<script lang="ts">
	import { createEventDispatcher, onMount } from "svelte";
	import CapLayer from "./CapLayer.svelte";
	import { updateCapData } from "$lib";
	import {
		toolStore,
		selectedStore,
		projectFile,
		uiAccent,
		projectAction,
		canvasPan,
		canvasZoom,
	} from "$lib/stores";
	import { Canvas, Layer } from "svelte-canvas";
	import { get } from "svelte/store";
	import { clamp, getBlankCapData } from "$lib/util";
	let windowInnerWidth = 0;
	let windowInnerHeight = 0;
	let zoomMin = 0.5;
	let zoomMax = 5;

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

	let previousTouchX = 0;
	let previousTouchY = 0;
	let previousTouchDist = 0;

	let touchTransforming = false;
	let wasTouchTransforming = false; // this is used to block pointerend events after a touch has already ended, used for selection.

	function touchStartHandler(e: TouchEvent) {
		e.preventDefault();
		wasTouchTransforming = false;
		if (e.touches.length < 2) return;
		touchTransforming = true;

		let tX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
		let tY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
		let distance = Math.sqrt(
			Math.pow(e.touches[0].clientX - e.touches[1].clientX, 2) +
				Math.pow(e.touches[0].clientY - e.touches[1].clientY, 2)
		);

		previousTouchX = tX;
		previousTouchY = tY;
		previousTouchDist = distance;
	}

	function touchMoveHandler(e: TouchEvent) {
		e.preventDefault();
		if (e.touches.length < 2) return;
		touchTransforming = true;
		wasTouchTransforming = true;

		let tX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
		let tY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
		let distance = Math.sqrt(
			Math.pow(e.touches[0].clientX - e.touches[1].clientX, 2) +
				Math.pow(e.touches[0].clientY - e.touches[1].clientY, 2)
		);
		let dX = tX - previousTouchX;
		let dY = tY - previousTouchY;
		let pan = $canvasPan;
		pan.x += dX;
		pan.y += dY;
		canvasPan.set(pan, {hard: true});

		let scaleMultiplier = 1 + (distance / previousTouchDist - 1);

		handleZoom(scaleMultiplier, tX, tY);

		previousTouchX = tX;
		previousTouchY = tY;
		previousTouchDist = distance;
	}

	function touchEndHandler(e: TouchEvent) {
		touchTransforming = false;
	}

	function wheelHandler(e: WheelEvent) {
		let isTrackpad = Math.abs(e.deltaY) < 75; //arbitrary threshold, the deltaY of trackpads is much smaller than a wheel
		e.preventDefault();
		if (e.ctrlKey) {
			let zoomDelta = e.deltaY;
			if (isTrackpad) {
				zoomDelta *= 3;
			}
			let sign = Math.sign(zoomDelta);
			let deltaAdjustedSpeed = Math.min(0.25, Math.abs(zoomDelta / 128));
			let scaleMultiplier = Math.abs(1 - sign * deltaAdjustedSpeed);
			handleZoom(scaleMultiplier, e.clientX, e.clientY);
		} else if (!middleMouseDown) {
			let mult = $canvasZoom;
			if (isTrackpad) mult = Math.sqrt($canvasZoom);
			let pan = $canvasPan;
			pan.x -= (e.deltaX * mult) / 2;
			pan.y -= (e.deltaY * mult) / 2;
			canvasPan.set(pan, {hard: true});
		}
	}

	function handleZoom(delta: number, x: number, y: number) {
		let preZoom = $canvasZoom;
		let zoomStoreVal = preZoom;
		zoomStoreVal *= delta;
		zoomStoreVal = clamp(zoomStoreVal, zoomMin, zoomMax);
		let zoomFactor = zoomStoreVal / preZoom;
		let pan = $canvasPan;
		canvasZoom.set(zoomStoreVal, {hard: true});
		canvasPan.set({
			x: x - (x - pan.x) * zoomFactor,
			y: y - (y - pan.y) * zoomFactor,
		}, {hard: true});
	}

	function pointerDownHandler(e: PointerEvent) {
		e.preventDefault();
		if (touchTransforming) return;
		if (e.button == 1) middleMouseDown = true;
		pointerOnInterface = e.target == mainCanvas.getCanvas();
		mainClick = e.button == 0;
		clicked = true;
		selectBoxStartX = selectBoxEndX = (e.clientX - $canvasPan.x) / $canvasZoom;
		selectBoxStartY = selectBoxEndY = (e.clientY - $canvasPan.y) / $canvasZoom;
		if (capPlacementTool) {
			capCreateEndX = capCreateStartX =
				Math.floor(((e.clientX - $canvasPan.x) / $canvasZoom / gridSize) * 4) / 4 - 0.5;
			capCreateEndY = capCreateStartY =
				Math.floor(((e.clientY - $canvasPan.y) / $canvasZoom / gridSize) * 4) / 4 - 0.5;
		}
		if (capRotationTool && !e.altKey) {
			capRotateEndX = (((e.clientX - $canvasPan.x) / $canvasZoom / gridSize) * 4) / 4;
			capRotateEndY = (((e.clientY - $canvasPan.y) / $canvasZoom / gridSize) * 4) / 4;
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
				(((e.clientX - $canvasPan.x) / $canvasZoom / gridSize) * 4) / 4;
			capTranslateEndY = capTranslateStartY =
				(((e.clientY - $canvasPan.y) / $canvasZoom / gridSize) * 4) / 4;
		}
		if (capRotationTool || capTranslateTool)
			capActionStartData = [...structuredClone(get(selectedStore))];
		shiftKeyWhenClicked = e.shiftKey;
		if (mainClick && capSelectTool) selectBox = true;
	}
	function pointerMoveHandler(e: PointerEvent) {
		e.preventDefault();
		if (touchTransforming) return;
		if (clicked && mainClick && capSelectTool) selectBox = true;
		if (middleMouseDown) {
			let pan = $canvasPan;
			pan.x += e.movementX;
			pan.y += e.movementY
			canvasPan.set(pan, {hard: true});
		}
		if (selectBox && e.target == mainCanvas.getCanvas()) {
			selectBoxEndX = (e.clientX - $canvasPan.x) / $canvasZoom;
			selectBoxEndY = (e.clientY - $canvasPan.y) / $canvasZoom;
			//selectCaps(e);
		}

		if (capPlacementTool && !clicked) {
			capPlacementToolCapData.color = "#0ef2";
			capPlacementToolCapData.x =
				Math.floor(((e.clientX - $canvasPan.x) / $canvasZoom / gridSize) * 4) / 4 - 0.5;
			capPlacementToolCapData.y =
				Math.floor(((e.clientY - $canvasPan.y) / $canvasZoom / gridSize) * 4) / 4 - 0.5;
			capPlacementToolCapData.w = 1;
			capPlacementToolCapData.h = 1;
		}

		if (
			pointerOnInterface &&
			capRotationTool &&
			mainClick &&
			$selectedStore.length != 0
		) {
			capRotateEndX = (((e.clientX - $canvasPan.x) / $canvasZoom / gridSize) * 4) / 4;
			capRotateEndY = (((e.clientY - $canvasPan.y) / $canvasZoom / gridSize) * 4) / 4;
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
			capTranslateEndX = (((e.clientX - $canvasPan.x) / $canvasZoom / gridSize) * 4) / 4;
			capTranslateEndY = (((e.clientY - $canvasPan.y) / $canvasZoom / gridSize) * 4) / 4;
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
				Math.floor(((e.clientX - $canvasPan.x) / $canvasZoom / gridSize) * 4) / 4 - 0.5;
			capCreateEndY =
				Math.floor(((e.clientY - $canvasPan.y) / $canvasZoom / gridSize) * 4) / 4 - 0.5;
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
		if (wasTouchTransforming) return;
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
			capRotateEndX = (((e.clientX - $canvasPan.x) / $canvasZoom / gridSize) * 4) / 4;
			capRotateEndY = (((e.clientY - $canvasPan.y) / $canvasZoom / gridSize) * 4) / 4;
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
			gridMatrix?.translate($canvasPan.x - 0.5 * $canvasZoom, $canvasPan.y - 0.5 * $canvasZoom).scale($canvasZoom)
		);
		context.fillStyle = gridPattern;
		context.fillRect(0, 0, width, height);
	};
	$: selectionRender = ({ context, width, height }: CanvasRendererInput) => {
		if (homeTool) {
			canvasPan.set({x: 90, y: 90});
			canvasZoom.set(1);
			projectAction.set("none");
		}
		if (touchTransforming || wasTouchTransforming) return;
		if (selectBox && !capTranslateTool) {
			context.scale($canvasZoom, $canvasZoom);
			context.fillStyle = $uiAccent + "22";
			context.strokeStyle = $uiAccent;
			context.setLineDash([6, 8]);
			context.lineCap = "round";
			context.beginPath();
			context.roundRect(
				selectBoxStartX + $canvasPan.x / $canvasZoom,
				selectBoxStartY + $canvasPan.y / $canvasZoom,
				selectBoxEndX - selectBoxStartX,
				selectBoxEndY - selectBoxStartY,
				5
			);
			context.fill();
			context.stroke();
			context.scale(1 / $canvasZoom, 1 / $canvasZoom);
			context.setLineDash([]);
		}
		if (
			(rotationAnchorManuallySet && capRotationTool) ||
			(clicked && mainClick && capRotationTool && pointerOnInterface)
		) {
			context.setLineDash([]);
			context.scale($canvasZoom, $canvasZoom);
			context.lineCap = "round";
			context.fillStyle = $uiAccent;
			context.strokeStyle = $uiAccent;
			context.beginPath();
			context.arc(
				capRotateAnchorX * gridSize + $canvasPan.x / $canvasZoom,
				capRotateAnchorY * gridSize + $canvasPan.y / $canvasZoom,
				10,
				0,
				2 * Math.PI
			);
			context.stroke();
			context.fill();
			context.scale(1 / $canvasZoom, 1 / $canvasZoom);
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
			context.scale($canvasZoom, $canvasZoom);
			context.lineCap = "round";
			context.fillStyle = "#0007";
			context.strokeStyle = "#0007";
			context.beginPath();
			context.moveTo(
				capRotateAnchorX * gridSize + $canvasPan.x / $canvasZoom,
				capRotateAnchorY * gridSize + $canvasPan.y / $canvasZoom
			);
			context.arc(
				capRotateAnchorX * gridSize + $canvasPan.x / $canvasZoom,
				capRotateAnchorY * gridSize + $canvasPan.y / $canvasZoom,
				1 * gridSize,
				aStartTheta,
				theta - Math.PI / 2,
				theta - aStartTheta < 0
			);
			context.moveTo(
				capRotateAnchorX * gridSize + $canvasPan.x / $canvasZoom,
				capRotateAnchorY * gridSize + $canvasPan.y / $canvasZoom
			);
			context.lineTo(
				(capRotateAnchorX + lineDistX) * gridSize + $canvasPan.x / $canvasZoom,
				(capRotateAnchorY + lineDistY) * gridSize + $canvasPan.y / $canvasZoom
			);
			context.textAlign = "left";
			context.fillText(
				(((theta - aStartTheta - Math.PI / 2) * 180) / Math.PI).toFixed(1) +
					" deg",
				capRotateEndX * gridSize + $canvasPan.x / $canvasZoom + 10,
				capRotateEndY * gridSize + $canvasPan.y / $canvasZoom
			);
			context.stroke();
			context.lineWidth = 8;
			context.strokeStyle = "#fff7";
			context.beginPath();
			context.moveTo(
				capRotateAnchorX * gridSize + $canvasPan.x / $canvasZoom,
				capRotateAnchorY * gridSize + $canvasPan.y / $canvasZoom
			);
			context.lineTo(
				capRotateEndX * gridSize + $canvasPan.x / $canvasZoom,
				capRotateEndY * gridSize + $canvasPan.y / $canvasZoom
			);
			context.stroke();
			context.lineWidth = 4;
			context.strokeStyle = $uiAccent;
			context.setLineDash([6, 8]);
			context.stroke();
			context.scale(1 / $canvasZoom, 1 / $canvasZoom);
			context.setLineDash([]);
		}
	};
</script>

<svelte:window
	bind:innerWidth={windowInnerWidth}
	bind:innerHeight={windowInnerHeight}
	on:wheel|nonpassive={wheelHandler}
/>
<div
	id="canvas-event-wrapper"
	on:pointerdown|nonpassive={pointerDownHandler}
	on:pointerup|nonpassive={pointerUpHandler}
	on:pointermove|nonpassive={pointerMoveHandler}
	on:touchstart|nonpassive={touchStartHandler}
	on:touchmove|nonpassive={touchMoveHandler}
	on:touchend|nonpassive={touchEndHandler}
>
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
			<CapLayer unitSize={gridSize} {capData} />
		{/each}
		<Layer render={selectionRender} />
		{#if capPlacementTool && !touchTransforming && !wasTouchTransforming}
			<CapLayer
				unitSize={gridSize}
				capData={capPlacementToolCapData}
				previewTextValue={capPlacementToolCapData.w.toFixed(2) + "U"}
			/>
		{/if}
	</Canvas>
</div>
