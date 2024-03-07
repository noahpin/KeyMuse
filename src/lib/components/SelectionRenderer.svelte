<script lang="ts">
	import { buildSVGPathFromKeycapData, svgPathUnion } from "$lib/util";
	import Shape from "@doodle3d/clipper-js";
	import * as pkg from "svg-round-corners";
	const { parsePath, roundCommands, roundCorners } = pkg;
	export let selectedStore: any;
	let path = "";
	$: path = generateSelectedPath($selectedStore);
	function generateSelectedPath(selectedStore: any) {
		if (Array.isArray(selectedStore)) {
			let subjectPath = buildSVGPathFromKeycapData(selectedStore[0]);
			for (let i = 1; i < selectedStore.length; i++) {
				subjectPath = svgPathUnion(
					subjectPath,
					buildSVGPathFromKeycapData(selectedStore[i])
				);
			}
			return roundCorners(subjectPath, 3, 2).path;
		} else if (selectedStore) {
			let subjectPath = new Shape(buildPathFromKeycapData(selectedStore), true);
			return roundCorners(turnClipperPathToSVGPath(subjectPath), 3, 2).path;
		} else {
			return "";
		}
	}
	function buildPathFromKeycapData(keycapData: any) {
		return [
			[
				{ X: keycapData.x * 4, Y: keycapData.y * 4 },
				{ X: (keycapData.x + keycapData.width) * 4, Y: keycapData.y * 4 },
				{
					X: (keycapData.x + keycapData.width) * 4,
					Y: (keycapData.y + keycapData.height) * 4,
				},
				{ X: keycapData.x * 4, Y: (keycapData.y + keycapData.height) * 4 },
			],
		];
	}
	function turnClipperPathToSVGPath(clipperPath: any) {
		let svgPath = "";
		for (let i = 0; i < clipperPath.paths.length; i++) {
			let path = clipperPath.paths[i];
			svgPath += "M";
			for (let j = 0; j < path.length; j++) {
				svgPath += `${(path[j].X * 54) / 4},${(path[j].Y * 54) / 4}`;
				if (j < path.length - 1) svgPath += "L";
			}
			svgPath += "Z";
		}
		return svgPath;
	}

</script>

<g>
	<path
		stroke-dasharray="0 4 0"
		stroke-linecap="round"
		class="animate-path-offset"
		d={path}
		fill="none"
		stroke="blue"
		stroke-width="2"
	/>
</g>

<style>
	.animate-path-offset {
		animation: dash 2s linear infinite;
	}
	@keyframes dash {
		to {
			stroke-dashoffset: -40;
		}
	}
</style>
