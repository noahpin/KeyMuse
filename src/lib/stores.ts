import { getBlankCapData } from "$lib/util";
import { writable } from "svelte/store";

export const uiAccent = writable("#ff00ff");
export const toolStore = writable("select");
export const projectAction = writable("none");
export const selectedStore = writable<CapDataElement[]>([]);
//used to control when the property panel updates its data.
// TODO: make the property panel update if a specific data member updates, not based on the entire object.
export const propertyPanelStore = writable<CapDataElement>(getBlankCapData());
export const projectFile = writable<FileData>();
export const variableDeletionStore = writable();