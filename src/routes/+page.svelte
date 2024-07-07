<script lang="ts">
	import PropertiesPanel from "$lib/components/PropertiesPanel.svelte";
	import Renderer from "$lib/components/Renderer.svelte";
	import CanvasRenderer from "$lib/components/CanvasRenderer.svelte";
	import "$lib/styles/app.css";
	import { writable } from "svelte/store";
	import ToolBar from "$lib/components/ToolBar.svelte";
	import {layoutFile, selectedStore} from "$lib"

	$: enforceFileSchema(layoutFile);

	function createCap(e: any) {
		let temp = Object.create($layoutFile)
		temp.keyData.push(e.detail)
		layoutFile.set(temp)
	}
	function enforceFileSchema(file) {
		let keyData: [CapDataElement] = $layoutFile.keyData;
		for(let i = 0; i < keyData.length; i++) {
			let d = keyData[i]
			let tmp = {
				legends: d.legends || "",
				x: d.x || 0,
				y: d.y || 0,
				w: d.w || 1,
				h: d.h || 1,
				x2: d.x2 || 0,
				y2: d.y2 || 0,
				w2: d.w2 || null,
				h2: d.h2 || null,
				angle: d.angle || 0,
				color: d.color || "#fff",
				fontColor: d.fontColor || "#000",
				stepped: d.stepped != null ? d.stepped : false,
			};
			tmp.w2 = tmp.w2 || tmp.w
			tmp.h2 = tmp.h2 || tmp.h
			keyData[i] = tmp
		}
	}
</script>
<CanvasRenderer  {selectedStore} {layoutFile} on:createCap={createCap}></CanvasRenderer>
<!-- 
<Renderer {selectedStore} {layoutFile} on:createCap={createCap} /> -->
<PropertiesPanel></PropertiesPanel>
<ToolBar></ToolBar>