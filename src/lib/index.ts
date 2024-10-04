// place files you want to import through the `$lib` alias in this folder.
import { writable, get, type Writable } from "svelte/store";
import chroma from "chroma-js";
import {
	makeid,
	getBlankCapData,
	downloadJSON,
	openFilePicker,
	convertKLEJsonToNative,
	HTMLStringToBasicString,
	ensureNumber,
	serializeKeyMuseJSONToKLEJson,
} from "./util";
import * as kle from "@ijprest/kle-serial";

import {
	projectFile,
	propertyPanelStore,
	selectedStore,
	toastMessages,
	variableDeletionStore,
} from "./stores";


export function setProjectFile(file: FileData) {
	projectFile.set(enforceFileSchema(file));
}

export function updateCapData(
	targetCapData: CapDataElement[],
	property: string,
	value: any,
	delta: boolean = false,
	propagateUpdates: string | null = null,
	legendIndex: number | null = null
) {
	let temp = get(projectFile).keyData;
	let updateW2 = false;
	let updateH2 = false;
	targetCapData.forEach((cap: CapDataElement) => {
		let c: CapDataElement = temp[temp.indexOf(cap)];
		let newValue = value;
		if (delta) {
			newValue += c[property];
			newValue = Math.round(newValue * 1000) / 1000;
		}
		if (property == "w" && c.w == c.w2) {
			c.w2 = newValue;
			updateW2 = true;
		}
		if (property == "h" && c.h == c.h2) {
			c.h2 = newValue;
			updateH2 = true;
		}
		if (property == "legends" && legendIndex != null) {
			if (c.legends.length < 12) {
				let tmp = new Array(12);
				tmp.splice(0, c.legends.length, ...c.legends);
				c.legends = tmp;
			}
			c.legends[legendIndex] = newValue;
			return;
		}

		c[property] = newValue;
	});
	let tObj = get(projectFile);
	tObj.keyData = temp;
	projectFile.set(tObj);
	if (propagateUpdates != null || updateW2 || updateH2) {
		let tmp = { ...get(propertyPanelStore) };
		if (propagateUpdates != null) tmp[propagateUpdates] = Date.now();
		if (updateW2) tmp["w2"] = Date.now();
		if (updateH2) tmp["h2"] = Date.now();
		propertyPanelStore.set(tmp);
	}
}

export function alignCapsToGrid() {
	get(selectedStore).forEach((cap) => {
		let newX = Math.round(cap.x / 0.25) * 0.25;
		let newY = Math.round(cap.y / 0.25) * 0.25;
		updateCapData([cap], "x", newX);
		updateCapData([cap], "y", newY);
	});
}

export function exportProject() {
	downloadJSON(get(projectFile), "keymuse.json");
}

export function exportKLEJson() {
	downloadJSON(
		serializeKeyMuseJSONToKLEJson(get(projectFile)),
		"keymuse-kle.json"
	);
}

export async function openProjectFile() {
	let files = await openFilePicker(".json");
	let reader = new FileReader();
	if (files != null && files.length > 0) {
		reader.readAsText(files[0]);
		reader.onload = function (e) {
			let fileData = e.target?.result;
			let obj = JSON.parse(fileData as string);
			if (obj != null) {
				setProjectFile(obj);
			}
		};
	}
}

export async function openKLEJson() {
	let files = await openFilePicker(".json");
	let reader = new FileReader();
	if (files != null && files.length > 0) {
		reader.readAsText(files[0]);
		reader.onload = function (e) {
			let fileData = e.target?.result;
			let kleObj = kle.Serial.parse(fileData as string);
			let obj = convertKLEJsonToNative(kleObj);
			if (obj != null) {
				setProjectFile(obj);
			}
		};
	}
}

export function openKLERawData(rawData: string) {
	let kleObj = kle.Serial.parse(`[${rawData as string}]`);
	let obj = convertKLEJsonToNative(kleObj);
	if (obj != null) {
		setProjectFile(obj);
	}
}

export function enforceFileSchema(file: FileData): FileData {
	let keyData: [CapDataElement] | CapDataElement[] = file.keyData;
	for (let i = 0; i < keyData.length; i++) {
		let d = keyData[i];
		let tmp: CapDataElement = getBlankCapData();
		let legends = new Array(12);
		legends.fill(null);
		if (!Array.isArray(d.legends)) {
			legends[0] = d.legends;
		} else {
			legends.splice(0, d.legends.length, ...d.legends);
		}
		//ensure that there is no HTML content in the legends
		for (let i = 0; i < legends.length; i++) {
			var element = legends[i];
			element = HTMLStringToBasicString(element);
			legends[i] = element;
		}
		tmp.legends = legends;
		tmp.x = ensureNumber(d.x || 0);
		tmp.y = d.y || 0;
		tmp.w = ensureNumber(d.w || 1);
		tmp.h = ensureNumber(d.h || 1);
		tmp.x2 = ensureNumber(d.x2 || 0);
		tmp.y2 = ensureNumber(d.y2 || 0);
		tmp.w2 = ensureNumber(d.w2 || tmp.w);
		tmp.h2 = ensureNumber(d.h2 || tmp.h);
		tmp.r = ensureNumber(d.r || 0);
		tmp.color = d.color || "#fff";
		tmp.textColor = d.textColor || "#000";
		tmp.stepped = d.stepped != null ? d.stepped : false;
		tmp.decal = d.decal ?? false;
		tmp.homing = d.homing ?? false;

		keyData[i] = tmp;
	}
	let enforcedFile: FileData = {
		name: file.name,
		variables: file.variables ?? null,
		keyData: keyData,
	};
	return enforcedFile;
}

export function createCap(e: any) {
	let temp = Object.create(get(projectFile));
	temp.keyData.push(e.detail);
	projectFile.set(temp);
}

export function updateVariableData(
	id: string,
	name: string | null = null,
	color: string | null = null
) {
	let temp: FileData = get(projectFile);
	let el = temp.variables.find((e) => e.id == id);
	if (name != null && el != null) el.displayName = name;
	if (color != null && el != null) el.color = color;
	projectFile.set(temp);

	propertyPanelStore.set(get(propertyPanelStore));
}

export function getVariableData(id: string): string {
	return get(projectFile).variables.find((e) => e.id == id)?.color || "#ffffff";
}

export function parseCapColor(color: string): string {
	if (color.startsWith("#")) return color;
	else if (color.startsWith("$"))
		return getVariableData(color.replace("$", ""));
	return "#ff00ff";
}

export function getWhiteOrBlackFromColor(color: string) {
	let c = chroma(color).rgb();
	return c[0] * 0.299 + c[1] * 0.587 + c[2] * 0.114 > 186 ? "#000" : "#fff";
}

export function createVariable() {
	let temp: FileData = get(projectFile);
	let v: ColorVariable = {
		id: makeid(5),
		color: chroma.random().hex(),
		displayName: "Color Variable",
	};
	temp.variables.push(v);
	projectFile.set(temp);
}

export function deleteVariable(id: string) {
	let temp: FileData = get(projectFile);
	let v = temp.variables.find((e) => e.id == id);
	if (v == null) return;
	let i = temp.variables.indexOf(v);
	if (i > -1) temp.variables.splice(i, 1);
	projectFile.set(temp);
	variableDeletionStore.set(null);
}

export function selectAll(e: KeyboardEvent) {
	selectedStore.set(get(projectFile).keyData);
}

export function deleteSelection() {
	let temp = get(projectFile).keyData;
	temp = temp.filter((cap) => {
		return !get(selectedStore).includes(cap);
	});
	let file = get(projectFile);
	file.keyData = temp;
	projectFile.set(file);
	selectedStore.set([]);
}

export function nudgeSelectedCaps(e: KeyboardEvent) {
	let dX = e.key.includes("Right") ? 0.25 : e.key.includes("Left") ? -0.25 : 0;
	let dY = e.key.includes("Up") ? -0.25 : e.key.includes("Down") ? 0.25 : 0;
	if (e.shiftKey) {
		dX *= 4;
		dY *= 4;
	}
	if (e.altKey) {
		updateCapData(get(selectedStore), "w", dX, true, "w");
		updateCapData(get(selectedStore), "h", dY, true, "h");
		return;
	}
	updateCapData(get(selectedStore), "x", dX, true, "x");
	updateCapData(get(selectedStore), "y", dY, true, "y");
}

export function updateProjectProperty(property: string, event: Event | null) {
	if (!event?.target) return;
	updateCapData(
		get(selectedStore),
		property,
		(event.target as HTMLInputElement).type == "checkbox"
			? (event.target as HTMLInputElement).checked
			: (event.target as HTMLInputElement).value,
		false
	);
}

export function updateLegend(index: number, event: Event | null) {
	if (!event?.target) return;
	updateCapData(
		get(selectedStore),
		"legends",
		(event.target as HTMLInputElement).value,
		false,
		null,
		index
	);
}

export function addToastMessage(toast: ToastMessage) {
	let msgs = get(toastMessages);
	msgs.push({ id: makeid(10), toast: toast });
	toastMessages.set(msgs);
}

export function removeToastMessage(toastId: string) {
	let msgs = [...get(toastMessages)];
	let i = msgs.findIndex((t) => t.id == toastId);
	msgs.splice(i, 1)
	toastMessages.set(msgs)

}