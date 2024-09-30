<script lang="ts">
	import { selectedStore } from "$lib/stores";
	import { updateProjectProperty } from "$lib";
</script>

<label for="legend">Legend</label>
<div class="input-row">
	<input
		name="legend"
		type="text"
		value={$selectedStore[$selectedStore.length - 1].legends}
		on:input={(e) => updateProjectProperty("legends", e)}
	/>
	<input
		name="legend"
		type="text"
		value={$selectedStore[$selectedStore.length - 1].legends}
		on:input={(e) => updateProjectProperty("legends", e)}
	/>
	<input
		name="legend"
		type="text"
		value={$selectedStore[$selectedStore.length - 1].legends}
		on:input={(e) => updateProjectProperty("legends", e)}
	/>
</div>
<div class="input-row">
	<input
		name="legend"
		type="text"
		value={$selectedStore[$selectedStore.length - 1].legends}
		on:input={(e) => updateProjectProperty("legends", e)}
	/>
	<input
		name="legend"
		type="text"
		value={$selectedStore[$selectedStore.length - 1].legends}
		on:input={(e) => updateProjectProperty("legends", e)}
	/>
	<input
		name="legend"
		type="text"
		value={$selectedStore[$selectedStore.length - 1].legends}
		on:input={(e) => updateProjectProperty("legends", e)}
	/>
</div>
<div class="input-row">
	<input
		name="legend"
		type="text"
		value={$selectedStore[$selectedStore.length - 1].legends}
		on:input={(e) => updateProjectProperty("legends", e)}
	/>
	<input
		name="legend"
		type="text"
		value={$selectedStore[$selectedStore.length - 1].legends}
		on:input={(e) => updateProjectProperty("legends", e)}
	/>
	<input
		name="legend"
		type="text"
		value={$selectedStore[$selectedStore.length - 1].legends}
		on:input={(e) => updateProjectProperty("legends", e)}
	/>
</div>
<div class="input-row">
	<input
		name="legend"
		type="text"
		value={$selectedStore[$selectedStore.length - 1].legends}
		on:input={(e) => updateProjectProperty("legends", e)}
	/>
	<input
		name="legend"
		type="text"
		value={$selectedStore[$selectedStore.length - 1].legends}
		on:input={(e) => updateProjectProperty("legends", e)}
	/>
	<input
		name="legend"
		type="text"
		value={$selectedStore[$selectedStore.length - 1].legends}
		on:input={(e) => updateProjectProperty("legends", e)}
	/>
</div>

<style>
    
	.input-row {
		display: flex;
		width: 100%;
        gap: 4px;
	}
</style>