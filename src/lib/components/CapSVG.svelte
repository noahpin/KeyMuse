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

	let capBoxSvg = buildSVGPathFromKeycapData({
		x: 0,
		y: 0,
		width: unitWidth,
		height: unitHeight,
	});
	let secondaryCapBoxSvg = buildSVGPathFromKeycapData({
		x: 0,
		y: 0,
		width: secondaryUnitWidth,
		height: secondaryUnitHeight,
	});

	let totalHighlight = stepped ? highlightSvg : generateHighlightSvg(
		highlightSvg,
		secondaryHighlightSvg
	);

	let totalCapBox = generateHighlightSvg(capBoxSvg, secondaryCapBoxSvg);

	let showPreviewStyles = true;
	let svgWidth = width;
	let svgHeight = height;
	let capMaskPadding = 0.037;
	let capMaskWidth = svgWidth - capMaskPadding * 2;
	let capMaskHeight = svgHeight - capMaskPadding * 2;

	let capMaskSvg = buildSVGPathFromKeycapData({
		x: capMaskPadding,
		y: capMaskPadding,
		width: unitWidth - capMaskPadding * 2,
		height: unitHeight - capMaskPadding * 2,
	});
	let secondaryCapMaskSvg = buildSVGPathFromKeycapData({
		x: capMaskPadding,
		y: capMaskPadding,
		width: secondaryUnitWidth - capMaskPadding * 2,
		height: secondaryUnitHeight - capMaskPadding * 2,
	});

	let totalCapMask = roundCorners(
		generateHighlightSvg(capMaskSvg, secondaryCapMaskSvg),
		2,
		2
	).path;

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
		selected = Array.isArray($selectedStore)
			? $selectedStore.includes(capData)
			: $selectedStore === capData;
		legends = capData.legends || "";
		secondaryUnitWidth = capData.width2 || unitWidth;
		secondaryUnitHeight = capData.height2 || unitHeight;
		secondaryX = capData.x2 || 0;
		secondaryY = capData.y2 || 0;

		secondaryWidth = secondaryUnitWidth * 4;
		secondaryHeight = secondaryUnitHeight * 4;

		highlightSvg = `M12.752,10.524c-1.198.085-2.143,1.03-2.228,2.228-.204,2.878-.532,8.399-.532,14.248v${(height - 4) * capQuarterUnitSize}c0,5.849.327,11.371.532,14.248.085,1.198,1.03,2.143,2.228,2.228,2.878.204,8.399.532,14.248.532h${(width - 4) * capQuarterUnitSize}c5.849,0,11.371-.327,14.248-.532,1.198-.085,2.143-1.03,2.228-2.228.204-2.878.532-8.399.532-14.248v${(height - 4) * capQuarterUnitSize * -1}c0-5.849-.327-11.371-.532-14.248-.085-1.198-1.03-2.143-2.228-2.228-2.878-.204-8.399-.532-14.248-.532h${(width - 4) * capQuarterUnitSize * -1}c-5.849,0-11.371.327-14.248.532`;
		secondaryHighlightSvg = `M12.752,10.524c-1.198.085-2.143,1.03-2.228,2.228-.204,2.878-.532,8.399-.532,14.248v${(secondaryHeight - 4) * capQuarterUnitSize}c0,5.849.327,11.371.532,14.248.085,1.198,1.03,2.143,2.228,2.228,2.878.204,8.399.532,14.248.532h${(secondaryWidth - 4) * capQuarterUnitSize}c5.849,0,11.371-.327,14.248-.532,1.198-.085,2.143-1.03,2.228-2.228.204-2.878.532-8.399.532-14.248v${(secondaryHeight - 4) * capQuarterUnitSize * -1}c0-5.849-.327-11.371-.532-14.248-.085-1.198-1.03-2.143-2.228-2.228-2.878-.204-8.399-.532-14.248-.532h${(secondaryWidth - 4) * capQuarterUnitSize * -1}c-5.849,0-11.371.327-14.248.532`;

		capBoxSvg = buildSVGPathFromKeycapData({
			x: 0,
			y: 0,
			width: unitWidth,
			height: unitHeight,
		});
		secondaryCapBoxSvg = buildSVGPathFromKeycapData({
			x: 0,
			y: 0,
			width: secondaryUnitWidth,
			height: secondaryUnitHeight,
		});

		totalHighlight = stepped ? highlightSvg : generateHighlightSvg(highlightSvg, secondaryHighlightSvg);

		totalCapBox = generateHighlightSvg(capBoxSvg, secondaryCapBoxSvg);

		showPreviewStyles = true;
		svgWidth = width;
		svgHeight = height;
		capMaskWidth = svgWidth - capMaskPadding * 2;
		capMaskHeight = svgHeight - capMaskPadding * 2;

		capMaskSvg = buildSVGPathFromKeycapData({
			x: capMaskPadding,
			y: capMaskPadding,
			width: unitWidth - capMaskPadding * 2,
			height: unitHeight - capMaskPadding * 2,
		});
		secondaryCapMaskSvg = buildSVGPathFromKeycapData({
			x: capMaskPadding,
			y: capMaskPadding,
			width: secondaryUnitWidth - capMaskPadding * 2,
			height: secondaryUnitHeight - capMaskPadding * 2,
		});

		totalCapMask = roundCorners(
			generateHighlightSvg(capMaskSvg, secondaryCapMaskSvg),
			2,
			2
		).path;
	}

	function generateHighlightSvg(main: string, secondary: string) {
		//translate the secondary string by the secondary x and y
		const p = new paper.Project();

		// Create layers to organize paths
		const l = new paper.Layer();
		const secondaryPath = new paper.Path(secondary);
		l.addChild(secondaryPath);
		secondaryPath.translate(
			new paper.Point(
				secondaryX * capQuarterUnitSize * 4,
				secondaryY * capQuarterUnitSize * 4
			)
		);
		secondary = secondaryPath.pathData;

		l.remove();
		p.remove();
		secondaryPath.remove();

		return svgPathUnion(main, secondary);
	}

	function selectItem(e: MouseEvent) {
		if (e.shiftKey) {
			// if the type of selected store is an object  then make it an array. if its an array then push the capData to it
			if (Array.isArray($selectedStore)) {
				let arr = [...$selectedStore];
				if (!arr.includes(capData)) {
					arr.push(capData);
					selectedStore.set(arr);
				}
				console.log($selectedStore.length);
			} else {
				selectedStore.set([$selectedStore, capData]);
			}
		} else {
			selectedStore.set(capData);
		}
	}
	$: selected = Array.isArray($selectedStore)
		? $selectedStore.includes(capData)
		: $selectedStore === capData;
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
			<path
				transform="translate(0, -0)"
				d={totalCapMask}
				fill="#fff"
				stroke-width="0"
			/>
		</mask>
	</defs>
	<g mask={showPreviewStyles ? `url(#outline${capId})` : ""}>
		<rect
			width={svgWidth}
			height={svgHeight}
			fill={capColor}
			stroke-width="0"
		/>
		<path transform="translate(0, -0)" d={totalCapBox} fill={capColor} />
		{#if showPreviewStyles}
			<path
				transform="translate(0, -0)"
				d={totalHighlight}
				fill="#fff"
				stroke="#000"
				stroke-width="1.5"
				mix-blend-mode="overlay"
				opacity=".19"
			/>
			<g>
				<g id="f" data-name="Outline" mix-blend-mode="overlay" opacity=".19"
					><path
						transform="translate(0, -0)"
						d={totalCapBox}
						fill="#0000"
						stroke="#000"
						stroke-width="7"
					/>
				</g>
			</g>
		{/if}
		<rect
			x={capQuarterUnitSize}
			y={capQuarterUnitSize}
			fill="transparent"
			stroke="#f0f"
			width={textAlignmentWidth}
			height={textAlignmentHeight}
		>
		</rect>
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
