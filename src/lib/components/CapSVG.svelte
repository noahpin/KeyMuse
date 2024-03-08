<script lang="ts">
	import { makeid, svgPathUnion, buildSVGPathFromKeycapData } from "$lib/util";
	import paper from "paper";
	import { roundCorners } from "$lib/svgRoundCorners";
	let capId = makeid(5);
	export let capData: any = {};
	export let selectedStore: any;
	export let x = capData.x || 0;
	export let y = capData.y || 0;
	export let capColor = capData.color || "#969696";
	export let legends = capData.legends || "";
	let stepped = capData.stepped || false;
	let selected = false;
	let capQuarterUnitSize = 13.5;
	let unitWidth = capData.width || 1;
	let unitHeight = capData.height || 1;

	let secondaryUnitWidth = capData.width2 || unitWidth;
	let secondaryUnitHeight = capData.height2 || unitHeight;
	let secondaryX = capData.x2 || 0;
	let secondaryY = capData.y2 || 0;

	let width = unitWidth * 4;
	let height = unitHeight * 4;
	let secondaryWidth = secondaryUnitWidth * 4;
	let secondaryHeight = secondaryUnitHeight * 4;

	let highlightSvg = `M12.752,10.524c-1.198.085-2.143,1.03-2.228,2.228-.204,2.878-.532,8.399-.532,14.248v${(height - 4) * capQuarterUnitSize}c0,5.849.327,11.371.532,14.248.085,1.198,1.03,2.143,2.228,2.228,2.878.204,8.399.532,14.248.532h${(width - 4) * capQuarterUnitSize}c5.849,0,11.371-.327,14.248-.532,1.198-.085,2.143-1.03,2.228-2.228.204-2.878.532-8.399.532-14.248v${(height - 4) * capQuarterUnitSize * -1}c0-5.849-.327-11.371-.532-14.248-.085-1.198-1.03-2.143-2.228-2.228-2.878-.204-8.399-.532-14.248-.532h${(width - 4) * capQuarterUnitSize * -1}c-5.849,0-11.371.327-14.248.532`;
	let secondaryHighlightSvg = `M12.752,10.524c-1.198.085-2.143,1.03-2.228,2.228-.204,2.878-.532,8.399-.532,14.248v${(secondaryHeight - 4) * capQuarterUnitSize}c0,5.849.327,11.371.532,14.248.085,1.198,1.03,2.143,2.228,2.228,2.878.204,8.399.532,14.248.532h${(secondaryWidth - 4) * capQuarterUnitSize}c5.849,0,11.371-.327,14.248-.532,1.198-.085,2.143-1.03,2.228-2.228.204-2.878.532-8.399.532-14.248v${(secondaryHeight - 4) * capQuarterUnitSize * -1}c0-5.849-.327-11.371-.532-14.248-.085-1.198-1.03-2.143-2.228-2.228-2.878-.204-8.399-.532-14.248-.532h${(secondaryWidth - 4) * capQuarterUnitSize * -1}c-5.849,0-11.371.327-14.248.532`;

	let showPreviewStyles = true;
	let svgWidth = width * capQuarterUnitSize;
	let svgHeight = height * capQuarterUnitSize;
	let capMaskPadding = 3;
	let capMaskWidth = svgWidth - capMaskPadding * 2;
	let capMaskHeight = svgHeight - capMaskPadding * 2;
	let secondarySvgWidth = secondaryWidth * capQuarterUnitSize;
	let secondarySvgHeight = secondaryHeight * capQuarterUnitSize;
	let secondaryCapMaskWidth = secondarySvgWidth - capMaskPadding * 2;
	let secondaryCapMaskHeight = secondarySvgHeight - capMaskPadding * 2;

	let textAlignmentWidth = (width - 2) * capQuarterUnitSize;
	let textAlignmentHeight = (height - 2) * capQuarterUnitSize;
	$: {
		stepped = capData.stepped || false;
		x = capData.x || 0;
		y = capData.y || 0;
		capColor = capData.color || "#969696";
		unitWidth = capData.width || 1;
		unitHeight = capData.height || 1;
		width = unitWidth * 4;
		height = unitHeight * 4;
		svgWidth = width * capQuarterUnitSize;
		svgHeight = height * capQuarterUnitSize;
		capMaskWidth = svgWidth - capMaskPadding * 2;
		capMaskHeight = svgHeight - capMaskPadding * 2;
		textAlignmentWidth = (width - 2) * capQuarterUnitSize;
		textAlignmentHeight = (height - 2) * capQuarterUnitSize;
		selected = $selectedStore.includes(capData);
		legends = capData.legends || "";
		secondaryUnitWidth = capData.width2 || unitWidth;
		secondaryUnitHeight = capData.height2 || unitHeight;
		secondaryX = capData.x2 || 0;
		secondaryY = capData.y2 || 0;

		secondaryWidth = secondaryUnitWidth * 4;
		secondaryHeight = secondaryUnitHeight * 4;
		secondarySvgWidth = secondaryWidth * capQuarterUnitSize;
		secondarySvgHeight = secondaryHeight * capQuarterUnitSize;
		secondaryCapMaskWidth = secondarySvgWidth - capMaskPadding * 2;
		secondaryCapMaskHeight = secondarySvgHeight - capMaskPadding * 2;

		highlightSvg = `M12.752,10.524c-1.198.085-2.143,1.03-2.228,2.228-.204,2.878-.532,8.399-.532,14.248v${(height - 4) * capQuarterUnitSize}c0,5.849.327,11.371.532,14.248.085,1.198,1.03,2.143,2.228,2.228,2.878.204,8.399.532,14.248.532h${(width - 4) * capQuarterUnitSize}c5.849,0,11.371-.327,14.248-.532,1.198-.085,2.143-1.03,2.228-2.228.204-2.878.532-8.399.532-14.248v${(height - 4) * capQuarterUnitSize * -1}c0-5.849-.327-11.371-.532-14.248-.085-1.198-1.03-2.143-2.228-2.228-2.878-.204-8.399-.532-14.248-.532h${(width - 4) * capQuarterUnitSize * -1}c-5.849,0-11.371.327-14.248.532`;
		secondaryHighlightSvg = `M12.752,10.524c-1.198.085-2.143,1.03-2.228,2.228-.204,2.878-.532,8.399-.532,14.248v${(secondaryHeight - 4) * capQuarterUnitSize}c0,5.849.327,11.371.532,14.248.085,1.198,1.03,2.143,2.228,2.228,2.878.204,8.399.532,14.248.532h${(secondaryWidth - 4) * capQuarterUnitSize}c5.849,0,11.371-.327,14.248-.532,1.198-.085,2.143-1.03,2.228-2.228.204-2.878.532-8.399.532-14.248v${(secondaryHeight - 4) * capQuarterUnitSize * -1}c0-5.849-.327-11.371-.532-14.248-.085-1.198-1.03-2.143-2.228-2.228-2.878-.204-8.399-.532-14.248-.532h${(secondaryWidth - 4) * capQuarterUnitSize * -1}c-5.849,0-11.371.327-14.248.532`;

		showPreviewStyles = true;
	}

	function selectItem(e: MouseEvent) {
		if ($selectedStore == null) selectedStore.set([]);
		if (e.shiftKey) {
			// if the type of selected store is an object  then make it an array. if its an array then push the capData to it
			let arr = [...$selectedStore];
			if (!arr.includes(capData)) {
				arr.push(capData);
				selectedStore.set(arr);
			}
			console.log($selectedStore.length);
		} else if (e.ctrlKey) {
			//toggle the selected state of the capData
			let arr = [...$selectedStore];
			if (arr.includes(capData)) {
				arr = arr.filter((item) => item !== capData);
				selectedStore.set(arr);
			} else {
				arr.push(capData);
				selectedStore.set(arr);
			}
		} else {
			selectedStore.set([capData]);
		}
	}
	$: selected = $selectedStore.includes(capData);
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<g
	transform={`translate(${x * capQuarterUnitSize * 4}, ${y * capQuarterUnitSize * 4})`}
	on:click={selectItem}
	class="svg-selectable"
>
	<defs>
		<mask id={"outline" + capId}>
			<rect
				x={capMaskPadding}
				y={capMaskPadding}
				width={capMaskWidth}
				height={capMaskHeight}
				fill="#fff"
				rx="1"
				ry="1"
			></rect>
			<rect
				x={capMaskPadding + secondaryX * capQuarterUnitSize * 4}
				y={capMaskPadding + secondaryY * capQuarterUnitSize * 4}
				width={secondaryCapMaskWidth}
				height={secondaryCapMaskHeight}
				fill="#fff"
				rx="1"
				ry="1"
			></rect>
		</mask>
	</defs>

	{#if showPreviewStyles}
		<g>
			<rect
				x={capMaskPadding}
				y={capMaskPadding}
				width={capMaskWidth}
				height={capMaskHeight}
				fill="#0000"
				stroke={capColor}
				stroke-width="2"
				rx="1"
				ry="1"
			></rect>
			<rect
				x={capMaskPadding + secondaryX * capQuarterUnitSize * 4}
				y={capMaskPadding + secondaryY * capQuarterUnitSize * 4}
				width={secondaryCapMaskWidth}
				height={secondaryCapMaskHeight}
				fill="#0000"
				stroke={capColor}
				stroke-width="2"
				rx="1"
				ry="1"
			></rect>
		</g>
		<g mix-blend-mode="overlay" opacity="0.19">
			<rect
				x={capMaskPadding}
				y={capMaskPadding}
				width={capMaskWidth}
				height={capMaskHeight}
				fill="#0000"
				stroke="#000"
				stroke-width="2"
				rx="1"
				ry="1"
			></rect>
			<rect
				x={capMaskPadding + secondaryX * capQuarterUnitSize * 4}
				y={capMaskPadding + secondaryY * capQuarterUnitSize * 4}
				width={secondaryCapMaskWidth}
				height={secondaryCapMaskHeight}
				fill="#0000"
				stroke="#000"
				stroke-width="2"
				rx="1"
				ry="1"
			></rect>
		</g>
	{/if}

	{#if selected}
		<g>
			<rect
				x={capMaskPadding}
				y={capMaskPadding}
				width={capMaskWidth}
				height={capMaskHeight}
				fill="#0000"
				stroke="red"
				stroke-width="4"
				rx="1"
				ry="1"
			></rect>
			<rect
				x={capMaskPadding + secondaryX * capQuarterUnitSize * 4}
				y={capMaskPadding + secondaryY * capQuarterUnitSize * 4}
				width={secondaryCapMaskWidth}
				height={secondaryCapMaskHeight}
				fill="#0000"
				stroke="red"
				stroke-width="4"
				rx="1"
				ry="1"
			></rect>
		</g>
	{/if}
	<g mask={showPreviewStyles ? `url(#outline${capId})` : ""}>
		<rect
			width={svgWidth}
			height={svgHeight}
			fill={capColor}
			stroke-width="0"
		/>
		<rect
			x={secondaryX * capQuarterUnitSize * 4}
			y={secondaryY * capQuarterUnitSize * 4}
			width={secondarySvgWidth}
			height={secondarySvgHeight}
			fill={capColor}
			stroke-width="0"
		/>
		{#if showPreviewStyles}
			<g mix-blend-mode="overlay" opacity=".19">
				<path
					transform="translate(0, -0)"
					d={highlightSvg}
					fill="#000"
					stroke="#000"
					stroke-width="2"
				/>
				<path
					stroke="#000"
					stroke-width="2"
					d={secondaryHighlightSvg}
					transform={`translate(${secondaryX * capQuarterUnitSize * 4}, ${
						secondaryY * capQuarterUnitSize * 4
					})`}
					x={secondaryX * capQuarterUnitSize * 4}
					y={secondaryY * capQuarterUnitSize * 4}
					fill="#000"
				/>
				<path transform="translate(0, -0)" d={highlightSvg} fill="#fff" />
				{#if !stepped}
					<path
						d={secondaryHighlightSvg}
						transform={`translate(${secondaryX * capQuarterUnitSize * 4}, ${
							secondaryY * capQuarterUnitSize * 4
						})`}
						x={secondaryX * capQuarterUnitSize * 4}
						y={secondaryY * capQuarterUnitSize * 4}
						fill="#fff"
					/>{/if}
			</g>
		{/if}
		<!-- <rect
			x={capQuarterUnitSize}
			y={capQuarterUnitSize}
			fill="transparent"
			stroke="#f0f"
			width={textAlignmentWidth}
			height={textAlignmentHeight}
		>
		</rect> -->
		<text
			x={textAlignmentWidth / 2 + capQuarterUnitSize}
			y={textAlignmentHeight / 2 + capQuarterUnitSize}
			font-size="10px"
			fill={capData.fontColor}
			alignment-baseline="central"
			text-anchor="middle"
			class="font-gorton">{legends}</text
		>
		<!-- <text
			x={capQuarterUnitSize}
			y={textAlignmentHeight / 2 + capQuarterUnitSize}
			font-size="10px"
			fill={capData.fontColor}
			alignment-baseline="central"
			text-anchor="start"
			class="font-gorton">{legends}</text
		>
		<text
			x={textAlignmentWidth + capQuarterUnitSize}
			y={textAlignmentHeight / 2 + capQuarterUnitSize}
			font-size="10px"
			fill={capData.fontColor}
			alignment-baseline="central"
			text-anchor="end"
			class="font-gorton">{legends}</text
		>

		<text
			x={textAlignmentWidth / 2 + capQuarterUnitSize}
			y={textAlignmentHeight + capQuarterUnitSize}
			font-size="10px"
			fill={capData.fontColor}
			alignment-baseline="after-edge"
			text-anchor="middle"
			class="font-gorton">{legends}</text
		>
		<text
			x={capQuarterUnitSize}
			y={textAlignmentHeight + capQuarterUnitSize}
			font-size="10px"
			fill={capData.fontColor}
			alignment-baseline="after-edge"
			text-anchor="start"
			class="font-gorton">{legends}</text
		>
		<text
			x={textAlignmentWidth + capQuarterUnitSize}
			y={textAlignmentHeight + capQuarterUnitSize}
			font-size="10px"
			fill={capData.fontColor}
			alignment-baseline="after-edge"
			text-anchor="end"
			class="font-gorton">{legends}</text
		>

		<text
			x={textAlignmentWidth / 2 + capQuarterUnitSize}
			y={capQuarterUnitSize}
			font-size="10px"
			fill={capData.fontColor}
			alignment-baseline="before-edge"
			text-anchor="middle"
			class="font-gorton">{legends}</text
		>
		<text
			x={capQuarterUnitSize}
			y={capQuarterUnitSize}
			font-size="10px"
			fill={capData.fontColor}
			alignment-baseline="before-edge"
			text-anchor="start"
			class="font-gorton">{legends}</text
		>
		<text
			x={textAlignmentWidth + capQuarterUnitSize}
			y={capQuarterUnitSize}
			font-size="10px"
			fill={capData.fontColor}
			alignment-baseline="before-edge"
			text-anchor="end"
			class="font-gorton">{legends}</text
		> -->
	</g>
</g>

<style>
	.font-gorton {
		font-family: "OpenGorton";
	}
</style>
