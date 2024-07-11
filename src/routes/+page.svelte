<script lang="ts">
	import PropertiesPanel from "$lib/components/PropertiesPanel.svelte";
	import CanvasRenderer from "$lib/components/CanvasRenderer.svelte";
	import "$lib/styles/app.css";
	import { writable, type Writable } from "svelte/store";
	import ToolBar from "$lib/components/ToolBar.svelte";
	import { createCap, enforceFileSchema, getBlankCapData, projectFile, selectedStore } from "$lib";
	import ProjectBar from "$lib/components/ProjectBar.svelte";
	import Logo from "$lib/components/Logo.svelte";

	$: enforceFileSchema(projectFile);
	
</script>

<CanvasRenderer on:createCap={createCap}></CanvasRenderer>
<PropertiesPanel></PropertiesPanel>
<ToolBar></ToolBar>
<ProjectBar></ProjectBar>
<Logo></Logo>
