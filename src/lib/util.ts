import type { Key, Keyboard } from "@ijprest/kle-serial";
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
		keyData: []
	};

	newJson.name = kle.meta.name;
	let formattedKeydata: CapDataElement[] = [];
	kle.keys.forEach((key: Key) => {
		let legends = new Array(12);
		legends.fill(null);
		legends.splice(0, key.labels.length, ...key.labels);
		legends = legends.map( l => l === undefined ? null : l);
		let newKey:CapDataElement = {
			legends:legends,
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
			stepped: key.stepped
		};
		console.log(newKey)

		formattedKeydata.push(newKey);
	});

	newJson.keyData = formattedKeydata;
	
	return newJson;
}
