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
				width: d.width || 1,
				height: d.height || 1,
				x2: d.x2 || 0,
				y2: d.y2 || 0,
				width2: d.width2 || null,
				height2: d.height2 || null,
				color: d.color || "#fff",
				fontColor: d.fontColor || "#000",
				stepped: d.stepped != null ? d.stepped : false
			};
			tmp.width2 = tmp.width2 || tmp.width
			tmp.height2 = tmp.height2 || tmp.height
			keyData[i] = tmp
		}
	}
</script>
<CanvasRenderer  {selectedStore} {layoutFile} on:createCap={createCap}></CanvasRenderer>
<!-- 
<Renderer {selectedStore} {layoutFile} on:createCap={createCap} /> -->
<PropertiesPanel></PropertiesPanel>
<ToolBar></ToolBar>