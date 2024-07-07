<script lang="ts">
	import { Layer } from "svelte-canvas";
	// @ts-ignore
	import chroma from "chroma-js";
	import { text } from "@sveltejs/kit";
	import gorton from "$lib/styles/fonts/OpenGorton-Bold.otf";
	import { onMount, onDestroy } from "svelte";
	import { selectedStore } from "$lib";
	export let capData: CapDataElement;
	export let unitSize;
	export let passive = false;
	export let previewTextValue = "";
	let x = capData.x;
	let y = capData.y;
	let w = capData.w;
	let h = capData.h;
	let x2 = capData.x2 || 0;
	let y2 = capData.y2 || 0;
	let w2 = capData.w2 || w;
	let h2 = capData.h2 || h;
	let angle = capData.angle || 0;
	let stepped = capData.stepped || false;
	let textColor = capData.fontColor || "black";
	let legend = capData.legends || "";
	let selected = false;
	export let panX;
	export let panY;
	export let zoom;
	let capPadding = 3;
	let capRadius = 2;
	let capHighlightPadding = 11;
	let capHighlightCentered: Boolean = true;

	let capColor = chroma(capData.color || "#969696");
	let capDarken = capColor.darken(0.35);
	let capEdge = capDarken.darken(0.5);

	var font;

	onMount(() => {
		font = new FontFace("gorton", `url(${gorton})`);
		font.load().then(function (nFont) {
			document.fonts.add(nFont);
		});
	});

	function upd(ss: CapDataElement) {
		x = capData.x;
		y = capData.y;
		w = capData.w;
		h = capData.h;
		x2 = parseFloat(`${capData.x2 || 0}`);
		y2 = parseFloat(`${capData.y2 || 0}`);
		w2 = capData.w2 || w;
		h2 = capData.h2 || h;
	    angle = capData.angle || 0;
		stepped = capData.stepped || false;
		textColor = capData.fontColor || "black";
		legend = capData.legends || "";
		capColor = chroma(capData.color || "#969696");
		capDarken = capColor.darken(0.35);
		capEdge = capDarken.darken(0.5);
	}
	$: upd(capData);

	let requestId;

	function rafLoop() {
		requestId = requestAnimationFrame(rafLoop);
		//angle += 0.01;
	}

	onMount(() => {
		requestId = requestAnimationFrame(rafLoop);
	});

	$: render = ({ context, width, height }: CanvasRendererInput) => {
        let xt = x * unitSize + panX / zoom
        let yt = y * unitSize + panY / zoom
		context.scale(zoom, zoom);
		context.translate(xt, yt);
		context.rotate(angle * Math.PI / 180);
		let cPad = capPadding * zoom;
		let cHPad = capHighlightPadding * zoom;
		context.fillStyle = capDarken.hex();
		context.strokeStyle = capEdge.hex();
		context.lineWidth = 3;
		context.beginPath();
		context.roundRect(
			cPad / zoom, cPad / zoom,
			w * unitSize - capPadding * 2,
			h * unitSize - capPadding * 2,
			capRadius
		);
		context.roundRect(
			x2*unitSize + cPad / zoom, y2 * unitSize + cPad / zoom,
			w2 * unitSize - capPadding * 2,
			h2 * unitSize - capPadding * 2,
			capRadius
		);

		if (selected) {
			context.lineWidth = 5 + capPadding;
			context.strokeStyle = "blue";
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
			cHPad / zoom,
				(cHPad - (cHPad / 2.5) * (1 - Number(capHighlightCentered))) /
					zoom,
			w * unitSize - capHighlightPadding * 2,
			h * unitSize - capHighlightPadding * 2,
			capRadius
		);
		if (!stepped) {
			context.roundRect(
				(x2) * unitSize + ( cHPad) / zoom,
				(y2) * unitSize +
					(cHPad - (cHPad / 2.5) * (1 - Number(capHighlightCentered))) /
						zoom,
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
		context.font = "12px gorton";
		context.fillText(
			legend,
			 (w / 2) * unitSize ,
			
				(h / 2) * unitSize +
				( (cHPad / 2.5) * (1 - Number(capHighlightCentered))) / zoom
		);
		context.textAlign = "right";
		context.textBaseline = "top";
		context.fillText(
			previewTextValue,
			w * unitSize,
			 h * unitSize
		);
		context.rotate(-1 * angle * Math.PI / 180);
		context.translate(-1 * xt, -1 * yt);
		context.scale(1 / zoom, 1 / zoom);
	};
	$: selected = $selectedStore.includes(capData);
</script>

<Layer {render} />
