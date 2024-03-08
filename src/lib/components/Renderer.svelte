<script lang="ts">
	import exampleJson from "./testJson.json";
	import CapSvg from "./CapSVG.svelte";
	import SelectionRenderer from "./SelectionRenderer.svelte";
	// export let data: any = null;
	// set viewbox to the current window size
	export let selectedStore: any;

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
	function pointerDownHandler(e: PointerEvent) {
		if (e.button == 1) middleMouseDown = true;
		clicked = true;
		clickStartX = selectBoxStartX = selectBoxEndX = (e.clientX - panX)/zoom;
		clickStartY = selectBoxStartY = selectBoxEndY = (e.clientY - panY)/zoom;
	}
	function pointerUpHandler(e: PointerEvent) {
		if (e.button == 1) middleMouseDown = false;
		if (e.target.id == "background" && !selectBox) selectedStore.set([]);
		selectBox = false;
		clicked = false;
	}
	function pointerMoveHandler(e: PointerEvent) {
		if (clicked && !middleMouseDown) selectBox = true;
		if (middleMouseDown) {
			panX += e.movementX;
			panY += e.movementY;
		}
		if (selectBox) {
			selectBoxEndX = (e.clientX - panX)/zoom;
			selectBoxEndY = (e.clientY - panY)/zoom;
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
			for (let i = 0; i < exampleJson.keydata.length; i++) {
				let cap = exampleJson.keydata[i];
				if (
					cap.x * 4 * 13.5 > selectBoxStartX &&
					cap.x * 4 * 13.5 < selectBoxEndX &&
					cap.y * 4 * 13.5 > selectBoxStartY &&
					cap.y * 4 * 13.5 < selectBoxEndY
				) {
					caught.push(cap);
				}
			}
			if(e.shiftKey) {
				caught = [...$selectedStore, ...caught];
			}else if (e.ctrlKey) {
				//remove caught from the selected
				caught = $selectedStore.filter((cap) => {
					return !caught.includes(cap);
				});
			}
			selectedStore.set(caught);
		}
	}
</script>

<svelte:window
	bind:innerWidth={windowInnerWidth}
	bind:innerHeight={windowInnerHeight}
/>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<svg {viewBox}
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
		{#each exampleJson.keydata as capData}
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
	</g>
</svg>

<style>
	svg {
		width: 100vw;
		height: 100vh;
	}
</style>
