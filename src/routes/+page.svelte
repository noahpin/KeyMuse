<script lang="ts">
	import PropertiesPanel from "$lib/components/PropertiesPanel.svelte";
	import Renderer from "$lib/components/Renderer.svelte";
	import CanvasRenderer from "$lib/components/CanvasRenderer.svelte";
	import "$lib/styles/app.css";
	import { writable } from "svelte/store";
	import exampleJson from "$lib/testJson.json";
	import ToolBar from "$lib/components/ToolBar.svelte";

	const selectedStore = writable([]);
	const layoutFile = writable(exampleJson);

	function createCap(e: any) {
		let temp = Object.create($layoutFile)
		temp.keydata.push(e.detail)
		layoutFile.set(temp)

	}
</script>
<CanvasRenderer {selectedStore} {layoutFile}></CanvasRenderer>
<!-- 
<Renderer {selectedStore} {layoutFile} on:createCap={createCap} /> -->
<PropertiesPanel {selectedStore}></PropertiesPanel>
<ToolBar></ToolBar>