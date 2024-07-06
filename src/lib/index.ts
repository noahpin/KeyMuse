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
	width: 0,
	height: 0,
	x2: 0,
	y2: 0,
	width2: 0,
	height2: 0,
	color: "string",
	fontColor: "string",
	stepped: true,
});
export const layoutFile = writable<FileData>();
// @ts-ignore
layoutFile.set(exampleJson);

export function updateCapData(
	targetCapData: CapDataElement[],
	property: string,
	value: any,
	delta: boolean = false,
    propagateUpdates: boolean = true
) {
	let temp = get(layoutFile).keyData;
	targetCapData.forEach((cap: CapDataElement) => {
		let c: CapDataElement = temp[temp.indexOf(cap)];
        let newValue = value;
		if (delta) {
			newValue += c[property];
		}
		if (property == "width" && c.width == c.width2) {
			c.width2 = newValue;
		}
		if (property == "height" && c.height == c.height2) c.height2 = newValue;
		c[property] = newValue;
	});
	let tObj = get(layoutFile);
	tObj.keyData = temp;
	layoutFile.set(tObj);
    if(propagateUpdates) {
        let tmp = {...get(propertyPanelStore)}
        tmp[property] = value;
        propertyPanelStore.set(tmp)
    }
}
