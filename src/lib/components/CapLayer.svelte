<script>
	import { Layer } from "svelte-canvas";
	import chroma from "chroma-js";
	import { text } from "@sveltejs/kit";
	import gorton from "$lib/styles/fonts/OpenGorton-Bold.otf";
	import { onMount } from "svelte";
	export let capData;
	export let selectedStore;
	export let unitSize;
	export let passive = false;
    export let previewTextValue = "";
	let x = capData.x;
	let y = capData.y;
	let w = capData.width;
	let h = capData.height;
	let x2 = capData.x2 || 0;
	let y2 = capData.y2 || 0;
	let w2 = capData.width2 || w;
	let h2 = capData.height2 || h;
	let stepped = capData.stepped || false;
	let textColor = capData.fontColor || "black";
	let legend = capData.legends || "";
	let selected = false;
	export let panX;
	export let panY;
	export let zoom;
	export let selectBox = false;
	let capPadding = 3;
	let capRadius = 2;
	let capHighlightPadding = 11;
	let capHighlightCentered = true;

	let capColor = chroma(capData.color || "#969696");
	let capDarken = capColor.darken(0.35);
	let capEdge = capDarken.darken(0.5);

	var font;

	onMount(() => {
		font = new FontFace("gorton", `url(${gorton})`);
        font.load().then(function(nFont){
            document.fonts.add(nFont);

        });
	});

	function upd(ss) {
		x = parseFloat(capData.x);
		y = parseFloat(capData.y);
		w = parseFloat(capData.width);
		h = parseFloat(capData.height);
		x2 = parseFloat(capData.x2 || 0);
		y2 = parseFloat(capData.y2 || 0);
		w2 = parseFloat(capData.width2 || w);
		h2 = parseFloat(capData.height2 || h);
		stepped = capData.stepped || false;
		textColor = capData.fontColor || "black";
		legend = capData.legends || "";
		capColor = chroma(capData.color || "#969696");
		capDarken = capColor.darken(0.35);
		capEdge = capDarken.darken(0.5);
	}
	$: upd($selectedStore);
	$: upd(capData);

	$: render = ({ context, width, height }) => {
		context.scale(zoom, zoom);
		let cPad = capPadding * zoom;
		let cHPad = capHighlightPadding * zoom;
		context.fillStyle = capDarken.hex();
		context.strokeStyle = capEdge.hex();
		context.lineWidth = 3;
		context.beginPath();
		context.roundRect(
			x * unitSize + (panX + cPad) / zoom,
			y * unitSize + (panY + cPad) / zoom,
			w * unitSize - capPadding * 2,
			h * unitSize - capPadding * 2,
			capRadius
		);
		context.roundRect(
			(x + x2) * unitSize + (panX + cPad) / zoom,
			(y + y2) * unitSize + (panY + cPad) / zoom,
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
		context.strokeStyle = capEdge.hex();
		context.stroke();
		context.fill();

		context.fillStyle = capColor.hex();
		context.beginPath();
		context.roundRect(
			x * unitSize + (panX + cHPad) / zoom,
			y * unitSize +
				(panY + cHPad - (cHPad / 2.5) * (1 - capHighlightCentered)) / zoom,
			w * unitSize - capHighlightPadding * 2,
			h * unitSize - capHighlightPadding * 2,
			capRadius
		);
		if (!stepped) {
			context.roundRect(
				(x + x2) * unitSize + (panX + cHPad) / zoom,
				(y + y2) * unitSize +
					(panY + cHPad - (cHPad / 2.5) * (1 - capHighlightCentered)) / zoom,
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
			x * unitSize + (w / 2) * unitSize + panX / zoom,
			y * unitSize +
				(h / 2) * unitSize +
				(panY - (cHPad / 2.5) * (1 - capHighlightCentered)) / zoom
		);
		context.textAlign = "right";
		context.textBaseline = "top";
		context.fillText(
			previewTextValue,
			x * unitSize + (w) * unitSize + panX / zoom,
			y * unitSize  +
				(h) * unitSize +
				(panY) / zoom
		);
		context.scale(1 / zoom, 1 / zoom);
	};

	function selectItem(e) {
		if (passive) return;
		if ($selectedStore == null) selectedStore.set([]);
	}
	$: selected = $selectedStore.includes(capData);
</script>

<Layer on:click={selectItem} {render} />
