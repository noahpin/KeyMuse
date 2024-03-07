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
	function pointerDownHandler(e: PointerEvent) {
		if (e.button == 1) middleMouseDown = true;
	}
	function pointerUpHandler(e: PointerEvent) {
		if (e.button == 1) middleMouseDown = false;
	}
	function pointerMoveHandler(e: PointerEvent) {
		if (middleMouseDown) {
			panX += e.movementX;
			panY += e.movementY;
		}
	}
	function clickHandler(e: MouseEvent) {
		if (e.target.id == "background") selectedStore.set(null);
		console.log(exampleJson)
	}
</script>

<svelte:window
	bind:innerWidth={windowInnerWidth}
	bind:innerHeight={windowInnerHeight}
	on:wheel|nonpassive={wheelHandler}
	on:pointerdown={pointerDownHandler}
	on:pointerup={pointerUpHandler}
	on:pointermove={pointerMoveHandler}
/>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<svg {viewBox} on:click={clickHandler}
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
	><rect id="background" width="100%" height="100%" transform="translate(0,0)" fill="url(#a)" />
	<g transform={`translate(${panX},${panY}) scale(${zoom})`}>
		{#each exampleJson.keydata as capData}
			<CapSvg {capData} {selectedStore}/>
		{/each}
			<SelectionRenderer {selectedStore}/>
	</g>
</svg>

<style>
	svg {
		width: 100vw;
		height: 100vh;
	}
</style>
