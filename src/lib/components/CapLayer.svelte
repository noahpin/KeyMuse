<script lang="ts">
	import { Layer } from "svelte-canvas";
	import chroma from "chroma-js";
	import { text } from "@sveltejs/kit";
	import gorton from "$lib/styles/fonts/OpenGorton-Bold.otf";
	import Astha from "$lib/styles/fonts/ASTHA-LATIN.otf";
	import { onMount, onDestroy } from "svelte";
	import { parseCapColor } from "$lib";
	import { canvasPan, canvasZoom, selectedStore, uiAccent } from "$lib/stores";
	export let capData: CapDataElement;
	export let unitSize;
	export let previewTextValue = "";
	let x = capData.x;
	let y = capData.y;
	let w = capData.w;
	let h = capData.h;
	let x2 = capData.x2 || 0;
	let y2 = capData.y2 || 0;
	let w2 = capData.w2 || w;
	let h2 = capData.h2 || h;
	let r = capData.r || 0;
	let stepped = capData.stepped || false;
	let textColor = parseCapColor(capData.textColor) || "black";
	let legend = capData.legends || "";
	let selected = false;
	let capPadding = 3;
	let capRadius = 2;
	let capHighlightPadding = 11;
	let capHighlightCentered: Boolean = true;
	let fontLoaded = false;
	let capColor = chroma(parseCapColor(capData.color) || "#969696");
	let capDarken = capColor.darken(0.35);
	let capEdge = capDarken.darken(0.5);

	let font;

	onMount(() => {
		font = new FontFace("CapFont", `url(${Astha})`);
		font.load().then(function (nFont) {
			document.fonts.add(nFont);
			fontLoaded = true;
		});
	});

	function updateData(ss: CapDataElement) {
		// its done this way because for some reason, doing it normally reactively doesnt work correctly.
		x = capData.x;
		y = capData.y;
		w = capData.w;
		h = capData.h;
		x2 = parseFloat(`${capData.x2 || 0}`);
		y2 = parseFloat(`${capData.y2 || 0}`);
		w2 = capData.w2 || w;
		h2 = capData.h2 || h;
		r = capData.r || 0;
		stepped = capData.stepped || false;
		textColor = parseCapColor(capData.textColor) || "black";
		legend = capData.legends || "";
		capColor = chroma(parseCapColor(capData.color) || "#969696");
		capDarken = capColor.darken(0.35);
		capEdge = capDarken.darken(0.5);
	}
	$: updateData(capData);

	$: render = ({ context, width, height }: CanvasRendererInput) => {
		if (fontLoaded) {
		}
		let xt = x * unitSize + $canvasPan.x / $canvasZoom;
		let yt = y * unitSize + $canvasPan.y / $canvasZoom;
		context.scale($canvasZoom, $canvasZoom);
		context.translate(xt, yt);
		context.rotate((r * Math.PI) / 180);
		let cPad = capPadding * $canvasZoom;
		let cHPad = capHighlightPadding * $canvasZoom;
		context.fillStyle = capDarken.hex();
		context.strokeStyle = capEdge.hex();
		context.lineWidth = 3;
		context.beginPath();
		context.roundRect(
			cPad / $canvasZoom,
			cPad / $canvasZoom,
			w * unitSize - capPadding * 2,
			h * unitSize - capPadding * 2,
			capRadius
		);
		context.roundRect(
			x2 * unitSize + cPad / $canvasZoom,
			y2 * unitSize + cPad / $canvasZoom,
			w2 * unitSize - capPadding * 2,
			h2 * unitSize - capPadding * 2,
			capRadius
		);

		if (selected) {
			context.lineWidth = 5 + capPadding;
			context.strokeStyle = $uiAccent;
			context.stroke();
			context.lineWidth = 1 + capPadding;
			context.strokeStyle = "white";
			context.stroke();
		}

		context.lineWidth = 3;
		context.stroke();
		context.strokeStyle = capEdge.hex();
		context.fill();

		context.fillStyle = capColor.hex();
		context.beginPath();
		context.roundRect(
			cHPad / $canvasZoom,
			(cHPad - (cHPad / 2.5) * (1 - Number(capHighlightCentered))) / $canvasZoom,
			w * unitSize - capHighlightPadding * 2,
			h * unitSize - capHighlightPadding * 2,
			capRadius
		);
		if (!stepped) {
			context.roundRect(
				x2 * unitSize + cHPad / $canvasZoom,
				y2 * unitSize +
					(cHPad - (cHPad / 2.5) * (1 - Number(capHighlightCentered))) / $canvasZoom,
				w2 * unitSize - capHighlightPadding * 2,
				h2 * unitSize - capHighlightPadding * 2,
				capRadius
			);
		}
		context.stroke();
		context.fill();
		context.fillStyle = textColor;
		context.textAlign = "center";
		context.textBaseline = "middle";
		context.font = "12px CapFont";
		context.fillText(
			legend,
			(w / 2) * unitSize,

			(h / 2) * unitSize +
				((cHPad / 2.5) * (1 - Number(capHighlightCentered))) / $canvasZoom
		);
		context.textAlign = "right";
		context.textBaseline = "top";
		context.fillText(previewTextValue, w * unitSize, h * unitSize);
		context.rotate((-1 * r * Math.PI) / 180);
		context.translate(-1 * xt, -1 * yt);
		context.scale(1 / $canvasZoom, 1 / $canvasZoom);
	};
	$: selected = $selectedStore.includes(capData);
</script>

<Layer {render} />
