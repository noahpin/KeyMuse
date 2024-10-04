import type { Key, Keyboard } from "@ijprest/kle-serial";
import sanitizeHtml from "sanitize-html";
import { decode } from "html-entities";
import { parseCapColor } from "$lib";
export function makeid(length: number): string {
	let result = "";
	const characters =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	const charactersLength = characters.length;
	let counter = 0;
	while (counter < length) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
		counter += 1;
	}
	return result;
}

export function setPixelated(ctx: CanvasRenderingContext2D) {
	if (ctx == undefined) return;
	ctx.imageSmoothingEnabled = false;
}

export function clamp(t: number, a: number, b: number) {
	return Math.min(Math.max(t, a), b);
}

export function getBlankCapData(): CapDataElement {
	let legends = new Array(12);
	legends.fill(null);
	return {
		legends: legends,
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
		decal: false,
		homing: false,
	};
}

export const lerp = (x: number, y: number, a: number): number =>
	x * (1 - a) + y * a;

export function downloadJSON(json: any, filename: string) {
	const blob = new Blob([JSON.stringify(json, null, 2)], {
		type: "application/json",
	});

	downloadBlob(blob, filename);
}

export function downloadBlob(blob: any, filename: string) {
	var a = document.createElement("a");

	var url = window.URL.createObjectURL(blob);
	a.href = url;
	a.download = filename;
	a.click();
	window.URL.revokeObjectURL(url);
}

export function openFilePicker(mimeType: string): Promise<File[] | null> {
	let picker = document.createElement("input");
	picker.type = "file";
	picker.accept = mimeType;
	picker.click();
	return new Promise<File[] | null>((resolve) => {
		picker.onchange = () => {
			const files = picker.files ? Array.from(picker.files) : null;
			resolve(files);
		};
	});
}

export function convertKLEJsonToNative(kle: Keyboard): FileData {
	let newJson: FileData = {
		name: "",
		variables: [],
		keyData: [],
	};

	newJson.name = kle.meta.name;
	let formattedKeydata: CapDataElement[] = [];
	kle.keys.forEach((key: Key) => {
		let legends = new Array(12);
		legends.fill(null);
		legends.splice(0, key.labels.length, ...key.labels);
		legends = legends.map((l) => (l === undefined ? null : l));
		let newKey: CapDataElement = {
			legends: legends,
			x: key.x,
			y: key.y,
			w: key.width,
			h: key.height,
			x2: key.x2,
			y2: key.y2,
			w2: key.width2,
			h2: key.height2,
			r: key.rotation_angle,
			color: key.color,
			textColor: key.default.textColor,
			stepped: key.stepped,
			decal: key.decal,
			homing: key.nub,
		};
		console.log(newKey);

		formattedKeydata.push(newKey);
	});

	newJson.keyData = formattedKeydata;

	return newJson;
}

export function HTMLStringToBasicString(string: string) {
	let cleanHtml = sanitizeHtml(string, {
		allowedTags: [],
		allowedAttributes: {},
	});
	cleanHtml = decode(cleanHtml);
	return cleanHtml;
}

export function serializeKeyMuseJSONToKLEJson(json: FileData) {
	let rawData = serializeKeyMuseJSONToKLERawData(json);
	rawData?.unshift({name: json.name});
	return rawData;

}

export function serializeKeyMuseJSONToKLERawData(json: FileData) {
	let keyData = json.keyData;
	if (keyData == null || keyData.length == 0) return;
	//first step is to sort all of the caps by their row.
	keyData.sort(capSortYFn);

	let minYPosition = Math.min(keyData[0].y, 0); //because we can have keys in negative positions, we need to normalize this.
	let groupedRows: { y: number; keys: CapDataElement[] }[] = [];
	let currentY = keyData[0].y;
	let currentRow: { y: number; keys: CapDataElement[] } = {
		y: keyData[0].y,
		keys: [],
	};
	keyData.forEach((key) => {
		if (key.y == currentY) {
			currentRow.keys.push(key);
		} else {
			groupedRows.push(currentRow);
			currentY = key.y;
			currentRow = {
				y: currentY,
				keys: [key],
			};
		}
	});
	groupedRows.push(currentRow);
	let minXPosition = 0; // same thing with y. we only want to offset if its negative, nto if positive.
	for (let i = 0; i < groupedRows.length; i++) {
		groupedRows[i].keys.sort(capSortXFn);
		minXPosition = Math.min(minXPosition, groupedRows[i].keys[0].x);
	}

	//at this point everything should be sorted. now, we need to normalize positions so that nothing is negative
	for (let i = 0; i < groupedRows.length; i++) {
		groupedRows[i].y -= minYPosition;
		for (let j = 0; j < groupedRows[i].keys.length; j++) {
			groupedRows[i].keys[j].x -= minXPosition;
			groupedRows[i].keys[j].y -= minYPosition;
		}
	}
	// to calculate the KLE rows, we can do it in several steps:
	// first, we need to calculate the un-offset position of this current cap, based off of the previous caps
	// position and size. we do NOT need to use the secondary positions and sizes in consideration here.
	// then, compare the "calculated" position with the expected position of this cap, and add any offset necessary.
	// we can first do this in the x-direction, since we have already grouped everything by rows.
	// for the rows, we need to consider the fact that KLE treats all rows as 1 unit tall. we can use a similar "compare and offset" approach
	let previousX = 0;
	let previousY = 0;
	let previousW = 0;
	let previousH = 0;
	let capColor = "";
	let textColor = "";
	let allKLEFormattedRows: any[] = [];
	let currentKLEFormattedRow: any[] = [];
	groupedRows.forEach((row, i) => {
		currentKLEFormattedRow = [];
		previousX = 0;
		previousW = 0;
		let offsetY = row.y - previousY;
		if (offsetY != 0) {
			currentKLEFormattedRow.push({ y: offsetY });
		}
		previousY += offsetY;
		previousY++;
		row.keys.forEach((key, i) => {
			let calculatedX = previousX + previousW;
			let offsetX = key.x - calculatedX;
			let prefix: any = {};
			if (offsetX != 0) {
				prefix.x = ensureNumber(offsetX);
			}
			if (key.w != 1) {
				prefix.w = ensureNumber(key.w);
			}
			if (key.h != 1) {
				prefix.h = ensureNumber(key.h);
			}
			if(key.x2 != 0) {
				prefix.x2 = ensureNumber(key.x2);
			}
			if(key.y2 != 0) {
				prefix.y2 = ensureNumber(key.y2);
			}
			if (key.w2 != key.w) {
				prefix.w2 = ensureNumber(key.w2);
			}
			if (key.h2 != key.h) {
				prefix.h2 = ensureNumber(key.h2);
			}
			if (key.color != capColor) {
				capColor = key.color;
				prefix.c = parseCapColor(capColor);
			}
			if (key.textColor != textColor) {
				textColor = key.textColor;
				prefix.t = parseCapColor(textColor);
			}
			if (key.homing) prefix.h = true;
			if (key.stepped) prefix.l = true;
			if (key.decal) prefix.d = true;

			if (Object.keys(prefix).length != 0) {
				currentKLEFormattedRow.push(prefix);
			}
			currentKLEFormattedRow.push(convertLegendsToKLEString(key.legends));
			previousX = key.x;
			previousW = key.w;
		});
		allKLEFormattedRows.push(currentKLEFormattedRow);
	});
	return allKLEFormattedRows;
}

export function convertKLEArrayToRawDataString(kleArray: any): string {
	let stringArray: string[] = [];
	kleArray.forEach((row: any) => {
		stringArray.push(JSON.stringify(row));
	});

	return stringArray.join(",\n");
}

function capSortYFn(a: CapDataElement, b: CapDataElement) {
	return a.y - b.y;
}

function capSortXFn(a: CapDataElement, b: CapDataElement) {
	return a.x - b.x;
}

export function ensureNumber(a: number | string) {
	return parseFloat(a as string);
}

function convertLegendsToKLEString(legends: (string | null)[]) {
	//kle has a weird mapping, as follows:
	let KLEArray = new Array(12);
	KLEArray[0] = legends[0];
	KLEArray[1] = legends[6];
	KLEArray[2] = legends[2];
	KLEArray[3] = legends[8];
	KLEArray[4] = legends[9];
	KLEArray[5] = legends[11];
	KLEArray[6] = legends[3];
	KLEArray[7] = legends[5];
	KLEArray[8] = legends[1];
	KLEArray[9] = legends[4];
	KLEArray[10] = legends[7];
	KLEArray[11] = legends[10];
	console.log(KLEArray)
	KLEArray = trimArray(KLEArray)
	console.log(KLEArray)
	return KLEArray.join("\n");
}

function trimArray(arr: any[]) {
    while (arr.length > 0 && (arr[arr.length - 1] === null || arr[arr.length - 1] === '')) {
        arr.pop();
    }
    return arr;
}