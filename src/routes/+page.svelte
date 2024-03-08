<script lang="ts">
	import PropertiesPanel from "$lib/components/PropertiesPanel.svelte";
	import Renderer from "$lib/components/Renderer.svelte";
	import "$lib/styles/app.css";
	import { writable } from "svelte/store";

	const selectedStore = writable([]);
</script>

<Renderer {selectedStore} />
<PropertiesPanel {selectedStore}></PropertiesPanel>
