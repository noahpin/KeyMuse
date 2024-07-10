<script lang="ts">
	import CapSvg from "./CapSVG.svelte";
	import SelectionRenderer from "./SelectionRenderer.svelte";
	import { createEventDispatcher } from "svelte";
	// export let data: any = null;
	// set viewbox to the current window size
	export let selectedStore: any;
	export let projectFile: any;

	let windowInnerWidth = 0;
	let windowInnerHeight = 0;
	let panX = 20;
	let panY = 20;
	let viewBox = `0 0 ${windowInnerWidth} ${windowInnerHeight}`;
	$: viewBox = `0 0 ${windowInnerWidth} ${windowInnerHeight}`;
	let zoom = 1;
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
	let capRotateAnchorX = 0;
	let capRotateAnchorY = 0;
	let capRotateEndX = 0;
	let capRotateEndY = 0;
	const dispatch = createEventDispatcher();
	let shiftKeyWhenClicked = false;
	function pointerDownHandler(e: PointerEvent) {
		if (e.button == 1) middleMouseDown = true;
		clicked = true;
		clickStartX = selectBoxStartX = selectBoxEndX = (e.clientX - panX) / zoom;
		clickStartY = selectBoxStartY = selectBoxEndY = (e.clientY - panY) / zoom;
		if (capPlacementTool) {
			capCreateEndX = capCreateStartX =
				Math.floor(((e.clientX - panX) / zoom / 54) * 4) / 4 - 0.5;
			capCreateEndY = capCreateStartY =
				Math.floor(((e.clientY - panY) / zoom / 54) * 4) / 4 - 0.5;
		}
		shiftKeyWhenClicked = e.shiftKey;
	}
	function pointerUpHandler(e: PointerEvent) {
		if (e.button == 1) middleMouseDown = false;
		if (e.target.id == "background" && !selectBox) selectedStore.set([]);
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
				w2: Math.max(1, capCreateEndX - capCreateStartX + 1),
				h2: Math.max(1, capCreateEndY - capCreateStartY + 1),
				color: "#e6e6e6",
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
		if (selectBox) {
			selectBoxEndX = (e.clientX - panX) / zoom;
			selectBoxEndY = (e.clientY - panY) / zoom;
			//if the end is less than start, set start to end and end to start
			if (selectBoxEndX < clickStartX) {
				let temp = selectBoxEndX;
				selectBoxEndX = clickStartX;
				selectBoxStartX = temp;
			}
			if (selectBoxEndY < clickStartY) {
				let temp = selectBoxEndY;
				selectBoxEndY = clickStartY;
				selectBoxStartY = temp;
			}
			//iterate through all the caps and check if they are in the box
			let caught = [];
			for (let i = 0; i < $projectFile.keyData.length; i++) {
				let cap = $projectFile.keyData[i];
				if (
					cap.x * 4 * 13.5 > selectBoxStartX &&
					cap.x * 4 * 13.5 < selectBoxEndX &&
					cap.y * 4 * 13.5 > selectBoxStartY &&
					cap.y * 4 * 13.5 < selectBoxEndY
				) {
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
				Math.floor(((e.clientX - panX) / zoom / 54) * 4) / 4 - 0.5;
			capPlacementToolCapData.y =
				Math.floor(((e.clientY - panY) / zoom / 54) * 4) / 4 - 0.5;
			capPlacementToolCapData.width = 1;
			capPlacementToolCapData.height = 1;
		}
		if (clicked && capPlacementTool) {
			capPlacementToolCapData.color = "#ececec";
			capPlacementToolCapData.x = capCreateStartX;
			capPlacementToolCapData.y = capCreateStartY;
			capCreateEndX =
				Math.floor(((e.clientX - panX) / zoom / 54) * 4) / 4 - 0.5;
			capCreateEndY =
				Math.floor(((e.clientY - panY) / zoom / 54) * 4) / 4 - 0.5;
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

	let capPlacementTool = true;
	let capPlacementToolCapData = {
		legends: "",
		x: 0,
		y: 0,
		width: 1,
		height: 1,
		x2: 0,
		y2: 0,
		w2: 0,
		h2: 0,
		color: "#0007",
	};
</script>

<svelte:window
	bind:innerWidth={windowInnerWidth}
	bind:innerHeight={windowInnerHeight}
/>
<svelte:document
	on:keyup={(e) => {
		if (e.target != document.body) return;
		if (e.key == "Escape") {
			capPlacementTool = false;
		}
		if (e.key == "c") {
			capPlacementTool = true;
		}
		if (e.key == "Delete") {
			let temp = [...$projectFile.keyData];
			temp = temp.filter((cap) => {
				return !$selectedStore.includes(cap);
			});
			projectFile.set({ keyData: temp });
		}
	}}
/>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<svg
	{viewBox}
	on:wheel|nonpassive={wheelHandler}
	on:pointerdown={pointerDownHandler}
	on:pointerup={pointerUpHandler}
	on:pointermove={pointerMoveHandler}
	><defs
		><pattern
			patternTransform={`translate(${panX},${panY}) scale(${zoom})`}
			id="a"
			patternUnits="userSpaceOnUse"
			width="54"
			height="54"
		>
			<rect x="0" y="0" width="3" height="0.5" fill="var(--grid-color)" />
			<rect x="0" y="0" width="0.5" height="3" fill="var(--grid-color)" />
			<rect x="51" y="0" width="3" height="0.5" fill="var(--grid-color)" />
			<rect x="53.5" y="0" width="0.5" height="3" fill="var(--grid-color)" />
			<rect x="0" y="53.5" width="3" height="0.5" fill="var(--grid-color)" />
			<rect x="0" y="51" width="0.5" height="3" fill="var(--grid-color)" />
			<rect x="51" y="53.5" width="3" height="0.5" fill="var(--grid-color)" />
			<rect x="53.5" y="51" width="0.5" height="3" fill="var(--grid-color)" />

			<rect x="13" y="0" width="1" height="0.5" fill="var(--grid-color)" />
			<rect x="26.5" y="0" width="1" height="0.5" fill="var(--grid-color)" />
			<rect x="40" y="0" width="1" height="0.5" fill="var(--grid-color)" />

			<rect x="0" y="13" width="0.5" height="1" fill="var(--grid-color)" />
			<rect x="13" y="13" width="1" height="1" fill="var(--grid-color)" />
			<rect x="26.5" y="13" width="1" height="1" fill="var(--grid-color)" />
			<rect x="40" y="13" width="1" height="1" fill="var(--grid-color)" />
			<rect x="53.5" y="13" width="1" height="1" fill="var(--grid-color)" />

			<rect x="0" y="26.5" width="0.5" height="1" fill="var(--grid-color)" />
			<rect x="13" y="26.5" width="1" height="1" fill="var(--grid-color)" />
			<rect x="26.5" y="26.5" width="1" height="1" fill="var(--grid-color)" />
			<rect x="40" y="26.5" width="1" height="1" fill="var(--grid-color)" />
			<rect x="53.5" y="26.5" width="1" height="1" fill="var(--grid-color)" />

			<rect x="0" y="40" width="0.5" height="1" fill="var(--grid-color)" />
			<rect x="13" y="40" width="1" height="1" fill="var(--grid-color)" />
			<rect x="26.5" y="40" width="1" height="1" fill="var(--grid-color)" />
			<rect x="40" y="40" width="1" height="1" fill="var(--grid-color)" />
			<rect x="53.5" y="40" width="1" height="1" fill="var(--grid-color)" />

			<rect x="13" y="53.5" width="1" height="1" fill="var(--grid-color)" />
			<rect x="26.5" y="53.5" width="1" height="1" fill="var(--grid-color)" />
			<rect x="40" y="53.5" width="1" height="1" fill="var(--grid-color)" />
		</pattern></defs
	><rect
		id="background"
		width="100%"
		height="100%"
		transform="translate(0,0)"
		fill="url(#a)"
	/>
	<g transform={`translate(${panX},${panY}) scale(${zoom})`}>
		{#each $projectFile.keyData as capData}
			<CapSvg {capData} {selectedStore} />
		{/each}
		{#if selectBox}
			<rect
				x={selectBoxStartX}
				y={selectBoxStartY}
				width={selectBoxEndX - selectBoxStartX}
				height={selectBoxEndY - selectBoxStartY}
				stroke="red"
				fill="none"
				stroke-width="2"
				rx="3"
				ry="3"
			></rect>{/if}
		<!-- <SelectionRenderer {selectedStore}/> -->

		{#if capPlacementTool}
			<CapSvg
				capData={capPlacementToolCapData}
				passive={true}
				{selectedStore}
				previewTextValue={capPlacementToolCapData.width.toFixed(2) + "U"}
			/>
		{/if}
	</g>
</svg>

<style>
	svg {
		width: 100vw;
		height: 100vh;
	}
</style>
