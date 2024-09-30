<script lang="ts">
	import { propertyPanelStore, selectedStore } from "$lib/stores";
	import { updateProjectProperty } from "$lib";

	export let property;
	export let step;
	export let name;
</script>

{#key $propertyPanelStore}
	<label for={name}>{name}</label>
	<input
		{name}
		type="number"
		{step}
		value={$selectedStore[$selectedStore.length - 1][property]}
		on:input={(e) => updateProjectProperty(property, e)}
	/>
{/key}
