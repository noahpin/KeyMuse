<script lang="ts">
	import { createEventDispatcher, onMount } from "svelte";
	import CapLayer from "./CapLayer.svelte";
	import { toolStore, updateCapData } from "$lib";
	// export let data: any = null;
	// set viewbox to the current window size
	export let selectedStore: any;
	export let layoutFile: any;

	let windowInnerWidth = 0;
	let windowInnerHeight = 0;
	let panX = 20;
	let panY = 20;
	let zoom = 1;

	let patternCanvas;

	let mainCanvas: any;
	let mainCtx;
	$: mainCtx = mainCanvas?.getContext();
	$: setPixelated(mainCtx);
	let gridPattern;
	$: gridPattern = mainCtx?.createPattern(patternCanvas, "repeat");
	let gridMatrix;

	let gridSize = 56;
	let quarter = gridSize / 4;

	onMount(() => {
		patternCanvas = document.createElement("canvas");
		//@ts-ignore
		const patternContext: CanvasRenderingContext2D =
			patternCanvas.getContext("2d");

		patternCanvas.width = patternCanvas.height = gridSize;

		setPixelated(patternContext);

		gridMatrix = new DOMMatrix();
		generateGrid(patternContext);
	});

	function setPixelated(ctx: CanvasRenderingContext2D) {
		if (ctx == undefined) return;
		ctx.msImageSmoothingEnabled = false;
		ctx.mozImageSmoothingEnabled = false;
		ctx.webkitImageSmoothingEnabled = false;
		ctx.imageSmoothingEnabled = false;
	}

	function generateGrid(ctx) {
		let cornerSize = 5;
		ctx.fillStyle = "#0004";
		for (let x = 0; x < 4; x++) {
			for (let y = 0; y < 4; y++) {
				ctx.fillRect(x * quarter, y * quarter, 1, 1);
			}
		}
		ctx.fillStyle = "#0006";
		ctx.fillRect(0, 0, 1, cornerSize);
		ctx.fillRect(1, 0, cornerSize - 1, 1);
		ctx.fillRect(0, gridSize - cornerSize + 1, 1, cornerSize);
		ctx.fillRect(gridSize - cornerSize + 1, 0, cornerSize, 1);
	}

	function wheelHandler(e: WheelEvent) {
		e.preventDefault();
		if (e.ctrlKey) {
			let zoomDelta = e.deltaY / 100;
			let zoomFactor = (zoom - zoomDelta) / zoom;
			zoom -= zoomDelta;
			if (zoom < 1) {
				zoom = 1;
				return;
			}
			if (zoom > 4) {
				zoom = 4;
				return;
			}
			panX = e.clientX - (e.clientX - panX) * zoomFactor;
			panY = e.clientY - (e.clientY - panY) * zoomFactor;
		} else {
			panX -= (e.deltaX * zoom) / 2;
			panY -= (e.deltaY * zoom) / 2;
		}
	}

	import { Canvas, Layer } from "svelte-canvas";
	import { tweened } from "svelte/motion";
	import { quadOut as easing } from "svelte/easing";
	import type { ParserOptions } from "svelte/types/compiler/interfaces";

	const position = tweened([0.5, 0.5], { duration: 400, easing });

	setInterval(() => {
		position.set([Math.random(), Math.random()]);
	}, 500);
	$: gridRender = ({ context, width, height }) => {
		gridPattern?.setTransform(
			gridMatrix?.translate(panX - 0.5 * zoom, panY - 0.5 * zoom).scale(zoom)
		);
		context.fillStyle = gridPattern;
		context.fillRect(0, 0, width, height);
	};
	$: selectionRender = ({ context, width, height }) => {
		if (selectBox) {
			context.scale(zoom, zoom);
			context.fillStyle = "#24a7ff44";
			context.strokeStyle = "#24a7ff";
			context.setLineDash([6, 8]);
			context.lineCap = "round";
			context.beginPath();
			context.roundRect(
				selectBoxStartX + panX / zoom,
				selectBoxStartY + panY / zoom,
				selectBoxEndX - selectBoxStartX,
				selectBoxEndY - selectBoxStartY,
				5
			);
			context.fill();
			context.stroke();
			context.scale(1 / zoom, 1 / zoom);
			context.setLineDash([]);
			context.lineCap = "butt";
		}
	};

	let middleMouseDown = false;
	let selectBox = false;
	let clickStartX = 0;
	let clickStartY = 0;
	let selectBoxStartX = 0;
	let selectBoxStartY = 0;
	let selectBoxEndX = 0;
	let selectBoxEndY = 0;
	let clicked = false;
	let capCreateStartX = 0;
	let capCreateStartY = 0;
	let capCreateEndX = 0;
	let capCreateEndY = 0;
	const dispatch = createEventDispatcher();
	let shiftKeyWhenClicked = false;

	function pointerDownHandler(e: PointerEvent) {
		if (e.button == 1) middleMouseDown = true;
		clicked = true;
		clickStartX = selectBoxStartX = selectBoxEndX = (e.clientX - panX) / zoom;
		clickStartY = selectBoxStartY = selectBoxEndY = (e.clientY - panY) / zoom;
		if (capPlacementTool) {
			capCreateEndX = capCreateStartX =
				Math.floor(((e.clientX - panX) / zoom / gridSize) * 4) / 4 - 0.5;
			capCreateEndY = capCreateStartY =
				Math.floor(((e.clientY - panY) / zoom / gridSize) * 4) / 4 - 0.5;
		}
		shiftKeyWhenClicked = e.shiftKey;
		if (!middleMouseDown && !capPlacementTool) selectBox = true;
		selectBoxEndX = (e.clientX - panX) / zoom;
		selectBoxEndY = (e.clientY - panY) / zoom;
	}
	function pointerUpHandler(e: PointerEvent) {
		if (e.button == 1) middleMouseDown = false;
		if (e.target == mainCanvas.getCanvas() && !selectBox) selectedStore.set([]);
		if (shiftKeyWhenClicked && capPlacementTool && previousCapPlacementData) {
			let amountX = Math.floor(
				(capCreateEndX - previousCapPlacementData.x) /
					previousCapPlacementData.width
			);
			let amountY = Math.floor(
				(capCreateEndY - previousCapPlacementData.y) /
					previousCapPlacementData.height
			);
			console.log(amountX, amountY);
			for (let i = 1; i <= amountX; i++) {
				let cap = {
					...previousCapPlacementData,
					x: previousCapPlacementData.x + previousCapPlacementData.width * i,
				};
				dispatch("createCap", cap);
			}
		}
		if (clicked && capPlacementTool && !shiftKeyWhenClicked) {
			let cap = {
				legends: "",
				x: capCreateStartX,
				y: capCreateStartY,
				width: Math.max(1, capCreateEndX - capCreateStartX + 1),
				height: Math.max(1, capCreateEndY - capCreateStartY + 1),
				x2: 0,
				y2: 0,
				width2: Math.max(1, capCreateEndX - capCreateStartX + 1),
				height2: Math.max(1, capCreateEndY - capCreateStartY + 1),
				color: "#e6e6e6",
				fontColor: "#000",
			};
			//broadcast an event to create a new cap
			dispatch("createCap", cap);
			previousCapPlacementData = cap;
		}
		selectBox = false;
		clicked = false;
	}
	function pointerMoveHandler(e: PointerEvent) {
		if (clicked && !middleMouseDown && !capPlacementTool) selectBox = true;
		if (middleMouseDown) {
			panX += e.movementX;
			panY += e.movementY;
		}
		if (selectBox && e.target == mainCanvas.getCanvas()) {
			selectBoxEndX = (e.clientX - panX) / zoom;
			selectBoxEndY = (e.clientY - panY) / zoom;
			//if the end is less than start, set start to end and end to start
			let cStartX = selectBoxStartX;
			let cEndX = selectBoxEndX;
			let cStartY = selectBoxStartY;
			let cEndY = selectBoxEndY;
			if (cEndX < cStartX) {
				let tmp = cStartX;
				cStartX = cEndX;
				cEndX = tmp;
			}
			if (cEndY < cStartY) {
				let tmp = cStartY;
				cStartY = cEndY;
				cEndY = tmp;
			}
			//iterate through all the caps and check if they are in the box
			let caught = [];
			for (let i = 0; i < $layoutFile.keyData.length; i++) {
				let cap = $layoutFile.keyData[i];
				let pairs = [
					[cStartX, cStartY],
					[cEndX, cEndY],
					[cEndX, cStartY],
					[cStartX, cEndY],
				];
				let capX = cap.x * 4 * quarter;
				let capY = cap.y * 4 * quarter;
				let capEndX = cap.width * gridSize + capX;
				let capEndY = cap.height * gridSize + capY;
				let capAdded = false;
				for (let p = 0; p < pairs.length; p++) {
					let pair = pairs[p];
					let cx = pair[0];
					let cy = pair[1];
					let xb = cx >= capX && cx <= capEndX;
					let yb = cy >= capY && cy <= capEndY;
					if (xb && yb) {
						caught.push(cap);
						capAdded = true;
						break;
					}
				}
				if (capAdded) continue;
				//now check if any of the edges are inside the cap
				let xe =
					capX <= cStartX &&
					cStartX <= capEndX &&
					cStartY <= capEndY &&
					cEndY >= capY;
				let ye =
					capY <= cStartY &&
					cStartY <= capEndY &&
					cStartX <= capEndX &&
					cEndX >= capX;
				let xee =
					capX <= cEndX &&
					cEndX <= capEndX &&
					cStartY <= capEndY &&
					cEndY >= capY;
				let yee =
					capY <= cEndY &&
					cEndY <= capEndY &&
					cStartX <= capEndX &&
					cEndX >= capX;
				if (xe || ye || xee || yee) {
					caught.push(cap);
					capAdded = true;
				}
				if (capAdded) continue;
				//see if the center of the cap is inside the bounds
				let centerX = (cap.width * gridSize) / 2 + capX;
				let centerY = (cap.height * gridSize) / 2 + capY;
				let cenx = cStartX <= centerX && centerX <= cEndX;
				let ceny = cStartY <= centerY && centerY <= cEndY;
				if (cenx && ceny) {
					caught.push(cap);
				}
			}
			if (e.shiftKey) {
				caught = [...$selectedStore, ...caught];
			} else if (e.ctrlKey) {
				//remove caught from the selected
				caught = $selectedStore.filter((cap) => {
					return !caught.includes(cap);
				});
			}
			selectedStore.set(caught);
		}

		if (capPlacementTool && !clicked) {
			capPlacementToolCapData.color = "#0ef2";
			capPlacementToolCapData.x =
				Math.floor(((e.clientX - panX) / zoom / gridSize) * 4) / 4 - 0.5;
			capPlacementToolCapData.y =
				Math.floor(((e.clientY - panY) / zoom / gridSize) * 4) / 4 - 0.5;
			capPlacementToolCapData.width = 1;
			capPlacementToolCapData.height = 1;
		}
		if (clicked && capPlacementTool) {
			capPlacementToolCapData.color = "#ececec";
			capPlacementToolCapData.x = capCreateStartX;
			capPlacementToolCapData.y = capCreateStartY;
			capCreateEndX =
				Math.floor(((e.clientX - panX) / zoom / gridSize) * 4) / 4 - 0.5;
			capCreateEndY =
				Math.floor(((e.clientY - panY) / zoom / gridSize) * 4) / 4 - 0.5;
			capPlacementToolCapData.width = Math.max(
				1,
				capCreateEndX - capCreateStartX + 1
			);
			capPlacementToolCapData.height = Math.max(
				1,
				capCreateEndY - capCreateStartY + 1
			);
		}
	}
	let previousCapPlacementData = {};

	let capPlacementTool = $toolStore == "placement";
	$: capPlacementTool = $toolStore == "placement";
	let capPlacementToolCapData = {
		legends: "",
		x: 0,
		y: 0,
		width: 1,
		height: 1,
		x2: 0,
		y2: 0,
		width2: 0,
		height2: 0,
		color: "#0007",
	};
</script>

<svelte:window
	bind:innerWidth={windowInnerWidth}
	bind:innerHeight={windowInnerHeight}
	on:wheel|nonpassive={wheelHandler}
	on:pointerdown={pointerDownHandler}
	on:pointerup={pointerUpHandler}
	on:pointermove={pointerMoveHandler}
	on:keydown={(e) => {
		if (e.target != document.body) return;
		if (e.key == "Escape") {
			capPlacementTool = false;
		}
		if (e.key == "c") {
			capPlacementTool = true;
		}
		if (e.key == "Delete") {
			let temp = [...$layoutFile.keyData];
			temp = temp.filter((cap) => {
				return !$selectedStore.includes(cap);
			});
			layoutFile.set({ keyData: temp });
            selectedStore.set([])
		}
		if (e.key.includes("Arrow")) {
			let dX = e.key.includes("Right")
				? 0.25
				: e.key.includes("Left")
					? -0.25
					: 0;
			let dY = e.key.includes("Up") ? -0.25 : e.key.includes("Down") ? 0.25 : 0;
			if (e.shiftKey) {
				dX *= 4;
				dY *= 4;
			}
			if (e.altKey) {
				updateCapData($selectedStore, "width", dX, true);
				updateCapData($selectedStore, "height", dY, true);
				return;
			}
			updateCapData($selectedStore, "x", dX, true);
			updateCapData($selectedStore, "y", dY, true);
		}
	}}
/>

<Canvas
	bind:this={mainCanvas}
	layerEvents={true}
	width={windowInnerWidth}
	height={windowInnerHeight}
	class={"background"}
>
	<Layer render={gridRender} />
	{#each $layoutFile.keyData as capData}
		<CapLayer
			unitSize={gridSize}
			{panX}
			{panY}
			{zoom}
			{capData}
			{selectedStore}
		/>
	{/each}
	<Layer render={selectionRender} />
	{#if capPlacementTool}
		<CapLayer
			unitSize={gridSize}
			{panX}
			{panY}
			{zoom}
			capData={capPlacementToolCapData}
			{selectedStore}
			previewTextValue={capPlacementToolCapData.width.toFixed(2) + "U"}
		/>
	{/if}
</Canvas>
