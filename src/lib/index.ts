// place files you want to import through the `$lib` alias in this folder.
import { writable, get, type Writable } from "svelte/store";
import templateFile from "$lib/template.json";
import chroma from "chroma-js";
import { makeid } from "./util";

export const uiAccent = writable("#ff00ff");
export const toolStore = writable("select");
export const projectAction = writable("none");
export const selectedStore = writable<CapDataElement[]>([]);
//used to control when the property panel updates its data.
// TODO: make the property panel update if a specific data member updates, not based on the entire object.
export const propertyPanelStore = writable<CapDataElement>(getBlankCapData());
export const projectFile = writable<FileData>();

export const variableDeletionStore = writable();
// @ts-ignore
projectFile.set(templateFile);

export function updateCapData(
	targetCapData: CapDataElement[],
	property: string,
	value: any,
	delta: boolean = false,
	propagateUpdates: boolean = true,
	snapNumeralData: number | null = null
) {
	let temp = get(projectFile).keyData;
	targetCapData.forEach((cap: CapDataElement) => {
		let c: CapDataElement = temp[temp.indexOf(cap)];
		let newValue = value;
		if (delta) {
			newValue += c[property];
			newValue = Math.round(newValue * 1000) / 1000;
		}
		if (property == "w" && c.w == c.w2) {
			c.w2 = newValue;
		}
		if (property == "h" && c.h == c.h2) c.h2 = newValue;
		c[property] = newValue;
	});
	let tObj = get(projectFile);
	tObj.keyData = temp;
	projectFile.set(tObj);
	if (propagateUpdates) {
		let tmp = { ...get(propertyPanelStore) };
		tmp[property] = value;
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

export function logData() {
	console.log(get(projectFile));
}

export function getBlankCapData(): CapDataElement {
	return {
		legends: "",
		x: 0,
		y: 0,
		w: 1,
		h: 1,
		x2: 0,
		y2: 0,
		w2: 0,
		h2: 0,
		color: "#0007",
		textColor: "#000",
		stepped: false,
		r: 0,
	};
}
export function enforceFileSchema(file: Writable<FileData>) {
	let keyData: [CapDataElement] | CapDataElement[] = get(file).keyData;
	for (let i = 0; i < keyData.length; i++) {
		let d = keyData[i];
		let tmp: CapDataElement = getBlankCapData();
		tmp.legends = d.legends || "";
		tmp.x = d.x || 0;
		tmp.y = d.y || 0;
		tmp.w = d.w || 1;
		tmp.h = d.h || 1;
		tmp.x2 = d.x2 || 0;
		tmp.y2 = d.y2 || 0;
		tmp.w2 = d.w2 || tmp.w;
		tmp.h2 = d.h2 || tmp.h;
		tmp.r = d.r || 0;
		tmp.color = d.color || "#fff";
		tmp.textColor = d.textColor || "#000";
		tmp.stepped = d.stepped != null ? d.stepped : false;

		keyData[i] = tmp;
	}
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
	console.log("selectall");
	e.preventDefault();
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
		updateCapData(get(selectedStore), "w", dX, true);
		updateCapData(get(selectedStore), "h", dY, true);
		return;
	}
	updateCapData(get(selectedStore), "x", dX, true);
	updateCapData(get(selectedStore), "y", dY, true);
}
