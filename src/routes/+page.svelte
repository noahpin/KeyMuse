<script lang="ts">
	import PropertiesPanel from "$lib/components/PropertiesPanel.svelte";
	import CanvasRenderer from "$lib/components/CanvasRenderer.svelte";
	import "$lib/styles/app.css";
	import { writable, type Writable } from "svelte/store";
	import ToolBar from "$lib/components/ToolBar.svelte";
	import {projectFile, selectedStore} from "$lib"
	import ProjectBar from "$lib/components/ProjectBar.svelte";
	import Logo from "$lib/components/Logo.svelte";

	$: enforceFileSchema(projectFile);

	function createCap(e: any) {
		let temp = Object.create($projectFile)
		temp.keyData.push(e.detail)
		projectFile.set(temp)
	}
	function enforceFileSchema(file: Writable<FileData>) {
		let keyData: [CapDataElement] | CapDataElement[] = $projectFile.keyData;
		for(let i = 0; i < keyData.length; i++) {
			let d = keyData[i]
			let tmp: CapDataElement = {
				legends: d.legends || "",
				x: d.x || 0,
				y: d.y || 0,
				w: d.w || 1,
				h: d.h || 1,
				x2: d.x2 || 0,
				y2: d.y2 || 0,
				w2: d.w2 || null,
				h2: d.h2 || null,
				r: d.r || 0,
				color: d.color || "#fff",
				textColor: d.textColor || "#000",
				stepped: d.stepped != null ? d.stepped : false,
			};
			tmp.w2 = tmp.w2 || tmp.w
			tmp.h2 = tmp.h2 || tmp.h
			keyData[i] = tmp
		}
	}
</script>
<CanvasRenderer on:createCap={createCap}></CanvasRenderer>
<PropertiesPanel></PropertiesPanel>
<ToolBar></ToolBar>
<ProjectBar></ProjectBar>
<Logo></Logo>