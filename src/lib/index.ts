// place files you want to import through the `$lib` alias in this folder.
import { writable, get, type Writable } from "svelte/store";
import templateFile from "$lib/template.json";

export const uiAccent = writable("#ff00ff");
export const toolStore = writable("select");
export const projectAction = writable("none");
export const selectedStore = writable<CapDataElement[]>([]);
//used to control when the property panel updates its data.
// TODO: make the property panel update if a specific data member updates, not based on the entire object.
export const propertyPanelStore = writable<CapDataElement>(getBlankCapData());
export const projectFile = writable<FileData>();
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
	console.log('asdf')
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