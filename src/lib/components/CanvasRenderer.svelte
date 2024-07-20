<script lang="ts">
	import { createEventDispatcher, onMount } from "svelte";
	import CapLayer from "./CapLayer.svelte";
	import {
		toolStore,
		updateCapData,
		selectedStore,
		projectFile,
		getBlankCapData,
		uiAccent,
		projectAction,
	} from "$lib";
	import { Canvas, Layer } from "svelte-canvas";
	import { tweened } from "svelte/motion";
	import { quadOut as easing } from "svelte/easing";
	import { get } from "svelte/store";
	let windowInnerWidth = 0;
	let windowInnerHeight = 0;
	let panX = 90;
	let panY = 90;
	let zoom = 1;

	let patternCanvas: HTMLCanvasElement;

	let mainCanvas: any;
	let mainCtx;
	$: mainCtx = mainCanvas?.getContext();
	let gridPattern;
	$: gridPattern = mainCtx?.createPattern(patternCanvas, "repeat");
	let gridMatrix: DOMMatrix;

	let gridSize = 56;
	let quarter = gridSize / 4;

	onMount(() => {
		patternCanvas = document.createElement("canvas");
		const patternContext: CanvasRenderingContext2D | null =
			patternCanvas.getContext("2d");

		patternCanvas.width = patternCanvas.height = gridSize;
		gridMatrix = new DOMMatrix();
		if (patternContext != null) generateGrid(patternContext);
	});

	function generateGrid(ctx: CanvasRenderingContext2D) {
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

	let middleMouseDown = false;
	let mainClick = false;
	let selectBox = false;
	let selectBoxStartX = 0;
	let selectBoxStartY = 0;
	let selectBoxEndX = 0;
	let selectBoxEndY = 0;
	let clicked = false;
	let capCreateStartX = 0;
	let capCreateStartY = 0;
	let capCreateEndX = 0;
	let capCreateEndY = 0;
	let capRotateAnchorX = 0;
	let capRotateAnchorY = 0;
	let capRotateEndX = 0;
	let capRotateEndY = 0;
	let capRotateAngleStartX = 0;
	let capRotateAngleStartY = 0;
	let capTranslateStartX = 0;
	let capTranslateStartY = 0;
	let capTranslateEndX = 0;
	let capTranslateEndY = 0;
	const dispatch = createEventDispatcher();
	let shiftKeyWhenClicked = false;
	let capActionStartData: CapDataElement[];

	let pointerOnInterface = false;
	let rotationAnchorManuallySet = false;

	function wheelHandler(e: WheelEvent) {
		e.preventDefault();
		if (e.ctrlKey) {
			let zoomDelta = e.deltaY / 100;
			let zoomFactor = (zoom - zoomDelta) / zoom;
			zoom -= zoomDelta;
			if (zoom < 0.75) {
				zoom = 0.75;
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

	function pointerDownHandler(e: PointerEvent) {
		if (e.button == 1) middleMouseDown = true;
		pointerOnInterface = e.target == mainCanvas.getCanvas();
		mainClick = e.button == 0;
		clicked = true;
		selectBoxStartX = selectBoxEndX = (e.clientX - panX) / zoom;
		selectBoxStartY = selectBoxEndY = (e.clientY - panY) / zoom;
		if (capPlacementTool) {
			capCreateEndX = capCreateStartX =
				Math.floor(((e.clientX - panX) / zoom / gridSize) * 4) / 4 - 0.5;
			capCreateEndY = capCreateStartY =
				Math.floor(((e.clientY - panY) / zoom / gridSize) * 4) / 4 - 0.5;
		}
		if (capRotationTool && !e.altKey) {
			capRotateEndX = (((e.clientX - panX) / zoom / gridSize) * 4) / 4;
			capRotateEndY = (((e.clientY - panY) / zoom / gridSize) * 4) / 4;
			capRotateAngleStartX = capRotateEndX;
			capRotateAngleStartY = capRotateEndY;
			if (!rotationAnchorManuallySet) {
				capRotateAnchorX = Math.round(capRotateEndX / 0.25) * 0.25;
				capRotateAnchorY = Math.round(capRotateEndY / 0.25) * 0.25;
				capRotateAngleStartX = capRotateAnchorX;
				capRotateAngleStartY = capRotateAnchorY - 2;
			}
		}
		if (capTranslateTool) {
			capTranslateEndX = capTranslateStartX =
				(((e.clientX - panX) / zoom / gridSize) * 4) / 4;
			capTranslateEndY = capTranslateStartY =
				(((e.clientY - panY) / zoom / gridSize) * 4) / 4;
		}
		if (capRotationTool || capTranslateTool)
			capActionStartData = [...structuredClone(get(selectedStore))];
		shiftKeyWhenClicked = e.shiftKey;
		if (mainClick && capSelectTool) selectBox = true;
	}
	function pointerMoveHandler(e: PointerEvent) {
		if (clicked && mainClick && capSelectTool) selectBox = true;
		if (middleMouseDown) {
			panX += e.movementX;
			panY += e.movementY;
		}
		if (selectBox && e.target == mainCanvas.getCanvas()) {
			selectBoxEndX = (e.clientX - panX) / zoom;
			selectBoxEndY = (e.clientY - panY) / zoom;
			//selectCaps(e);
		}

		if (capPlacementTool && !clicked) {
			capPlacementToolCapData.color = "#0ef2";
			capPlacementToolCapData.x =
				Math.floor(((e.clientX - panX) / zoom / gridSize) * 4) / 4 - 0.5;
			capPlacementToolCapData.y =
				Math.floor(((e.clientY - panY) / zoom / gridSize) * 4) / 4 - 0.5;
			capPlacementToolCapData.w = 1;
			capPlacementToolCapData.h = 1;
		}

		if (
			pointerOnInterface &&
			capRotationTool &&
			mainClick &&
			$selectedStore.length != 0
		) {
			capRotateEndX = (((e.clientX - panX) / zoom / gridSize) * 4) / 4;
			capRotateEndY = (((e.clientY - panY) / zoom / gridSize) * 4) / 4;
			$selectedStore.forEach((capSelected, i) => {
				let cap = capActionStartData[i];
				let r = Math.sqrt(
					Math.pow(cap.x - capRotateAnchorX, 2) +
						Math.pow(cap.y - capRotateAnchorY, 2)
				);
				let theta = Math.atan2(
					cap.x - capRotateAnchorX,
					-(cap.y - capRotateAnchorY)
				);
				theta -= Math.PI / 2;
				let dTheta = Math.atan2(
					capRotateEndX - capRotateAnchorX,
					-(capRotateEndY - capRotateAnchorY)
				);
				let aStartTheta = Math.atan2(
					capRotateAngleStartX - capRotateAnchorX,
					-(capRotateAngleStartY - capRotateAnchorY)
				);
				dTheta -= aStartTheta;
				//convert  dTheta  to  degrees
				dTheta = (dTheta / Math.PI) * 180;
				let angleSnap = 1;
				if (e.ctrlKey) {
					angleSnap = 5;
				}
				dTheta = Math.round(dTheta / angleSnap) * angleSnap;
				dTheta = (dTheta * Math.PI) / 180;

				theta += dTheta;
				console.log(cap.r);
				let capAngle = cap.r + (dTheta * 180) / Math.PI;

				let nDX = r * Math.cos(theta) + capRotateAnchorX;
				let nDY = r * Math.sin(theta) + capRotateAnchorY;

				updateCapData([capSelected], "x", Math.round(nDX * 100) / 100);
				updateCapData([capSelected], "y", Math.round(nDY * 100) / 100);
				updateCapData(
					[capSelected],
					"r",
					Math.round(capAngle * 100) / 100,
					false,
					true,
					100
				);
			});
		}
		if (
			pointerOnInterface &&
			capTranslateTool &&
			mainClick &&
			$selectedStore.length != 0
		) {
			capTranslateEndX = (((e.clientX - panX) / zoom / gridSize) * 4) / 4;
			capTranslateEndY = (((e.clientY - panY) / zoom / gridSize) * 4) / 4;
			$selectedStore.forEach((capSelected, i) => {
				let cap = capActionStartData[i];
				let dX = capTranslateEndX - capTranslateStartX;
				let dY = capTranslateEndY - capTranslateStartY;
				let snapValue = 4;
				if (e.ctrlKey) {
					snapValue = 100;
				}

				let nX = cap.x + dX;
				let nY = cap.y + dY;
				nX = Math.round(nX * snapValue) / snapValue;
				nY = Math.round(nY * snapValue) / snapValue;
				updateCapData([capSelected], "x", nX);
				updateCapData([capSelected], "y", nY);
			});
		}
		if (mainClick && capPlacementTool && pointerOnInterface) {
			capPlacementToolCapData.color = "#ececec";
			capCreateEndX =
				Math.floor(((e.clientX - panX) / zoom / gridSize) * 4) / 4 - 0.5;
			capCreateEndY =
				Math.floor(((e.clientY - panY) / zoom / gridSize) * 4) / 4 - 0.5;
			let cStartX = capCreateStartX;
			let cStartY = capCreateStartY;
			let cEndX = capCreateEndX;
			let cEndY = capCreateEndY;
			if (cEndX < cStartX) {
				let tmp = cEndX;
				cEndX = cStartX;
				cStartX = tmp;
			}
			if (cEndY < cStartY) {
				let tmp = cEndY;
				cEndY = cStartY;
				cStartY = tmp;
			}
			capPlacementToolCapData.x = cStartX;
			capPlacementToolCapData.y = cStartY;

			capPlacementToolCapData.w = Math.max(1, cEndX - cStartX + 1);
			capPlacementToolCapData.h = Math.max(1, cEndY - cStartY + 1);
		}
	}
	function pointerUpHandler(e: PointerEvent) {
		if (
			e.target == mainCanvas.getCanvas() &&
			capSelectTool &&
			!shiftKeyWhenClicked &&
			mainClick
		)
			selectedStore.set([]);
		if (
			shiftKeyWhenClicked &&
			capPlacementTool &&
			previousCapPlacementData &&
			mainClick
		) {
			let cStartX = previousCapPlacementData.x;
			let cStartY = previousCapPlacementData.y;
			let cEndX = capCreateEndX;
			let cEndY = capCreateEndY;
			if (cEndX < cStartX) {
				let tmp = cEndX;
				cEndX = cStartX;
				cStartX = tmp;
			}
			if (cEndY < cStartY) {
				let tmp = cEndY;
				cEndY = cStartY;
				cStartY = tmp;
			}
			let amountX = Math.floor((cEndX - cStartX) / previousCapPlacementData.w);
			let amountY = Math.floor((cEndY - cStartY) / previousCapPlacementData.h);
			console.log(amountX, amountY);
			let temp = [...$projectFile.keyData];
			temp = temp.filter((cap) => {
				return cap != previousCapPlacementData;
			});
			let file = $projectFile;
			file.keyData = temp;
			projectFile.set(file);
			for (let ax = 0; ax <= amountX; ax++) {
				for (let ay = 0; ay <= amountY; ay++) {
					let cap = {
						...previousCapPlacementData,
						x: cStartX + previousCapPlacementData.w * ax,
						y: cStartY + previousCapPlacementData.h * ay,
					};
					dispatch("createCap", cap);
				}
			}
		}
		if (selectBox && capSelectTool && e.target == mainCanvas.getCanvas()) {
			selectCaps(e);
		}
		if (clicked && capRotationTool && mainClick && $selectedStore.length != 0) {
		}
		if (capRotationTool && e.altKey && mainClick && clicked) {
			capRotateEndX = (((e.clientX - panX) / zoom / gridSize) * 4) / 4;
			capRotateEndY = (((e.clientY - panY) / zoom / gridSize) * 4) / 4;
			capRotateAnchorX = Math.round(capRotateEndX / 0.25) * 0.25;
			capRotateAnchorY = Math.round(capRotateEndY / 0.25) * 0.25;
			rotationAnchorManuallySet = true;
		}
		if (
			pointerOnInterface &&
			clicked &&
			capPlacementTool &&
			!shiftKeyWhenClicked &&
			mainClick
		) {
			let cStartX = capCreateStartX;
			let cStartY = capCreateStartY;
			let cEndX = capCreateEndX;
			let cEndY = capCreateEndY;
			if (cEndX < cStartX) {
				let tmp = cEndX;
				cEndX = cStartX;
				cStartX = tmp;
			}
			if (cEndY < cStartY) {
				let tmp = cEndY;
				cEndY = cStartY;
				cStartY = tmp;
			}
			let cap = {
				legends: "",
				x: cStartX,
				y: cStartY,
				w: Math.max(1, cEndX - cStartX + 1),
				h: Math.max(1, cEndY - cStartY + 1),
				x2: 0,
				y2: 0,
				w2: Math.max(1, cEndX - cStartX + 1),
				h2: Math.max(1, cEndY - cStartY + 1),
				color: "#e6e6e6",
				textColor: "#000",
				stepped: false,
				r: 0,
			};
			//broadcast an event to create a new cap
			dispatch("createCap", cap);
			previousCapPlacementData = cap;
		}
		middleMouseDown = false;
		selectBox = false;
		clicked = false;
		mainClick = false;
	}

	function selectCaps(e: PointerEvent) {
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
		let caught: CapDataElement[] = [];
		for (let i = 0; i < $projectFile.keyData.length; i++) {
			let cap = $projectFile.keyData[i];
			let pairs = [
				[cStartX, cStartY],
				[cEndX, cEndY],
				[cEndX, cStartY],
				[cStartX, cEndY],
			];
			let capX = cap.x * 4 * quarter;
			let capY = cap.y * 4 * quarter;
			let capEndX = cap.w * gridSize + capX;
			let capEndY = cap.h * gridSize + capY;
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
			let centerX = (cap.w * gridSize) / 2 + capX;
			let centerY = (cap.h * gridSize) / 2 + capY;
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
			caught = $selectedStore.filter((cap: CapDataElement) => {
				return !caught.includes(cap);
			});
		}
		selectedStore.set(caught);
	}

	let previousCapPlacementData: CapDataElement;

	let capSelectTool = $toolStore == "select";
	$: capSelectTool = $toolStore == "select";
	let capPlacementTool = $toolStore == "placement";
	$: capPlacementTool = $toolStore == "placement";
	let capRotationTool = $toolStore == "rotate";
	$: {
		capRotationTool = $toolStore == "rotate";
		rotationAnchorManuallySet = false;
	}
	let capTranslateTool = $toolStore == "translate";
	$: capTranslateTool = $toolStore == "translate";

	let capPlacementToolCapData: CapDataElement = getBlankCapData();

	let homeTool = $projectAction == "home";
	$: homeTool = $projectAction == "home";

	$: gridRender = ({ context, width, height }: CanvasRendererInput) => {
		gridPattern?.setTransform(
			gridMatrix?.translate(panX - 0.5 * zoom, panY - 0.5 * zoom).scale(zoom)
		);
		context.fillStyle = gridPattern;
		context.fillRect(0, 0, width, height);
	};
	$: selectionRender = ({ context, width, height }: CanvasRendererInput) => {
		if (homeTool) {
			panX = 90
			panY = 90
			projectAction.set("none")
		}
		if (selectBox) {
			context.scale(zoom, zoom);
			context.fillStyle = $uiAccent + "22";
			context.strokeStyle = $uiAccent;
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
		}
		if (
			(rotationAnchorManuallySet && capRotationTool) ||
			(clicked && mainClick && capRotationTool && pointerOnInterface)
		) {
			context.setLineDash([]);
			context.scale(zoom, zoom);
			context.lineCap = "round";
			context.fillStyle = $uiAccent;
			context.strokeStyle = $uiAccent;
			context.beginPath();
			context.arc(
				capRotateAnchorX * gridSize + panX / zoom,
				capRotateAnchorY * gridSize + panY / zoom,
				10,
				0,
				2 * Math.PI
			);
			context.stroke();
			context.fill();
			context.scale(1 / zoom, 1 / zoom);
		}
		if (clicked && mainClick && capRotationTool && pointerOnInterface) {
			let theta = Math.atan2(
				capRotateEndX - capRotateAnchorX,
				capRotateAnchorY - capRotateEndY
			);
			let aStartTheta = Math.atan2(
				capRotateAngleStartX - capRotateAnchorX,
				-(capRotateAngleStartY - capRotateAnchorY)
			);
			aStartTheta -= Math.PI / 2;
			let lineDistX = 2 * Math.cos(aStartTheta);
			let lineDistY = 2 * Math.sin(aStartTheta);

			context.setLineDash([]);
			context.scale(zoom, zoom);
			context.lineCap = "round";
			context.fillStyle = "#0007";
			context.strokeStyle = "#0007";
			context.beginPath();
			context.moveTo(
				capRotateAnchorX * gridSize + panX / zoom,
				capRotateAnchorY * gridSize + panY / zoom
			);
			context.arc(
				capRotateAnchorX * gridSize + panX / zoom,
				capRotateAnchorY * gridSize + panY / zoom,
				1 * gridSize,
				aStartTheta,
				theta - Math.PI / 2,
				theta - aStartTheta < 0
			);
			context.moveTo(
				capRotateAnchorX * gridSize + panX / zoom,
				capRotateAnchorY * gridSize + panY / zoom
			);
			context.lineTo(
				(capRotateAnchorX + lineDistX) * gridSize + panX / zoom,
				(capRotateAnchorY + lineDistY) * gridSize + panY / zoom
			);
			context.textAlign = "left";
			context.fillText(
				(((theta - aStartTheta - Math.PI / 2) * 180) / Math.PI).toFixed(1) +
					" deg",
				capRotateEndX * gridSize + panX / zoom + 10,
				capRotateEndY * gridSize + panY / zoom
			);
			context.stroke();
			context.lineWidth = 8;
			context.strokeStyle = "#fff7";
			context.beginPath();
			context.moveTo(
				capRotateAnchorX * gridSize + panX / zoom,
				capRotateAnchorY * gridSize + panY / zoom
			);
			context.lineTo(
				capRotateEndX * gridSize + panX / zoom,
				capRotateEndY * gridSize + panY / zoom
			);
			context.stroke();
			context.lineWidth = 4;
			context.strokeStyle = $uiAccent;
			context.setLineDash([6, 8]);
			context.stroke();
			context.scale(1 / zoom, 1 / zoom);
			context.setLineDash([]);
		}
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
		if (e.ctrlKey && e.key == "a") {
			e.preventDefault()
			selectedStore.set($projectFile.keyData);
		}
		if (e.key == "Escape") {
			toolStore.set("select");
		}
		if (e.key == "c") {
			toolStore.set("placement");
		}
		if (e.key == "r") {
			toolStore.set("rotate");
		}
		if (e.key == "t") {
			toolStore.set("translate");
		}
		if (e.key == "h") {
			projectAction.set("home");
		}
		if (e.key == "Delete") {
			let temp = $projectFile.keyData;
			temp = temp.filter((cap) => {
				return !$selectedStore.includes(cap);
			});
			let file = $projectFile;
			file.keyData = temp;
			projectFile.set(file);
			selectedStore.set([]);
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
				updateCapData($selectedStore, "w", dX, true);
				updateCapData($selectedStore, "h", dY, true);
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
	class={"background " +
		(capTranslateTool ? "cursor-translate " : "") +
		(capRotationTool ? "cursor-rotation " : "")}
>
	<Layer render={gridRender} />
	{#each $projectFile.keyData as capData}
		<CapLayer unitSize={gridSize} {panX} {panY} {zoom} {capData} />
	{/each}
	<Layer render={selectionRender} />
	{#if capPlacementTool}
		<CapLayer
			unitSize={gridSize}
			{panX}
			{panY}
			{zoom}
			capData={capPlacementToolCapData}
			previewTextValue={capPlacementToolCapData.w.toFixed(2) + "U"}
		/>
	{/if}
</Canvas>
