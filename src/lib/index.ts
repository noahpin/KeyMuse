// place files you want to import through the `$lib` alias in this folder.
import { writable, get } from "svelte/store";
import exampleJson from "$lib/testJson.json";

export const toolStore = writable("select");
export const selectedStore = writable([]);
export const layoutFile = writable(exampleJson);

export function updateCapData(targetCapData, property : string, value : any, delta: boolean = false) {
    let temp = [...get(layoutFile).keyData]
    targetCapData.forEach((cap: any) => {
        let c = temp[temp.indexOf(cap)]
        if(property == "width" && c.width == c.width2) {
            c.width2 = value + (delta ? c.width2 : 0);
        }
        if(property == "height" && c.height == c.height2) c.height2 = value + (delta ? c.height2 : 0);
        c[property] = value + (delta ? c[property] : 0);
        
    });
    let tObj = get(layoutFile)
    tObj.keyData = temp
    layoutFile.set(tObj);
}