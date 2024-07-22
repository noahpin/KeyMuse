<script lang="ts">
	import PropertiesPanel from "$lib/components/PropertiesPanel.svelte";
	import CanvasRenderer from "$lib/components/CanvasRenderer.svelte";
	import "$lib/styles/app.css";
	import { writable, type Writable } from "svelte/store";
	import ToolBar from "$lib/components/ToolBar.svelte";
	import { createCap, enforceFileSchema  } from "$lib";
	import {projectFile, selectedStore, uiAccent} from "$lib/stores"
	import ProjectBar from "$lib/components/ProjectBar.svelte";
	import Logo from "$lib/components/Logo.svelte";
	import { onMount } from "svelte";

	$: enforceFileSchema(projectFile);

	onMount(()=> {
		uiAccent.set(getComputedStyle(document.body).getPropertyValue("--accent"))
	})
	
</script>

<CanvasRenderer on:createCap={createCap}></CanvasRenderer>
<PropertiesPanel></PropertiesPanel>
<ToolBar></ToolBar>
<ProjectBar></ProjectBar>
<Logo></Logo>
