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

export function clamp (t: number, a: number, b: number) {
	return Math.min(Math.max(t, a), b)
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