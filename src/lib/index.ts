// place files you want to import through the `$lib` alias in this folder.
import { writable, get } from "svelte/store";
import exampleJson from "$lib/testJson.json";

export const toolStore = writable("select");
export const selectedStore = writable<CapDataElement[]>([]);
// @ts-ignore
export const propertyPanelStore = writable<CapDataElement>({
	legends: "string",
	x: 0,
	y: 0,
	w: 0,
	h: 0,
	x2: 0,
	y2: 0,
	w2: 0,
	h2: 0,
	color: "string",
	textColor: "string",
	stepped: true,
});
export const projectFile = writable<FileData>();
// @ts-ignore
projectFile.set(exampleJson);

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
            newValue = Math.round(newValue * 1000) / 1000
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
    if(propagateUpdates) {
        let tmp = {...get(propertyPanelStore)}
        tmp[property] = value;
        propertyPanelStore.set(tmp)
    }
}
