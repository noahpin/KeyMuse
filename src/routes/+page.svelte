<script lang="ts">
	import PropertiesPanel from "$lib/components/PropertiesPanel.svelte";
	import CanvasRenderer from "$lib/components/CanvasRenderer.svelte";
	import "$lib/styles/app.css";
	import { writable, type Writable } from "svelte/store";
	import ToolBar from "$lib/components/ToolBar.svelte";
	import { createCap, enforceFileSchema, setProjectFile } from "$lib";
	import { projectFile, selectedStore, uiAccent } from "$lib/stores";
	import ProjectBar from "$lib/components/ProjectBar.svelte";
	import Logo from "$lib/components/Logo.svelte";
	import { onMount } from "svelte";
	import ToastContainer from "$lib/components/ToastContainer.svelte";
	import templateFile from "$lib/template.json";

	onMount(() => {
		uiAccent.set(getComputedStyle(document.body).getPropertyValue("--accent"));

		setProjectFile(templateFile as FileData);
	});
</script>

<CanvasRenderer on:createCap={createCap}></CanvasRenderer>
<PropertiesPanel></PropertiesPanel>
<ToolBar></ToolBar>
<ProjectBar></ProjectBar>
<Logo></Logo>
<ToastContainer></ToastContainer>
