import { getBlankCapData } from "$lib/util";
import { spring } from "svelte/motion";
import { writable } from "svelte/store";

export const uiAccent = writable("#ff00ff");
export const toolStore = writable("select");
export const projectAction = writable("none");
export const selectedStore = writable<CapDataElement[]>([]);
//used to control when the property panel updates its data.
// TODO: make the property panel update if a specific data member updates, not based on the entire object.
export const propertyPanelStore = writable<PropertyPanelUpdateHandler>({
	legends: 0,
	legends0: 0,
	legends1: 0,
	legends2: 0,
	legends3: 0,
	legends4: 0,
	legends5: 0,
	legends6: 0,
	legends7: 0,
	legends8: 0,
	legends9: 0,
	legends10: 0,
	legends11: 0,
	x: 0,
	y: 0,
	w: 0,
	h: 0,
	x2: 0,
	y2: 0,
	w2: 0,
	h2: 0,
	r: 0,
	color: 0,
	textColor: 0,
	stepped: 0,
	decal: 0,
	homing: 0,
});
export const projectFile = writable<FileData>({name: "", variables: [], keyData: []});
export const variableDeletionStore = writable();

export const toastMessages = writable<{id: string, toast: ToastMessage}[]>([]);

export const canvasPan = spring({ x: 90, y: 90 });
export const canvasZoom = spring(1, { precision: 0.001 });
