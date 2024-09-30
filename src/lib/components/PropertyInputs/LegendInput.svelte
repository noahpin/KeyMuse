<script lang="ts">
	import { selectedStore } from "$lib/stores";
	import { updateLegend } from "$lib";

	
</script>

<label for="legend">Legend</label>
<div class="input-row">
	<input
		name="legend"
		type="text"
		value={$selectedStore[$selectedStore.length - 1].legends[0]}
		on:input={(e) => updateLegend(0, e)}
	/>
	<input
		name="legend"
		type="text"
		value={$selectedStore[$selectedStore.length - 1].legends[1]}
		on:input={(e) => updateLegend(1, e)}
	/>
	<input
		name="legend"
		type="text"
		value={$selectedStore[$selectedStore.length - 1].legends[2]}
		on:input={(e) => updateLegend(2, e)}
	/>
</div>
<div class="input-row">
	<input
		name="legend"
		type="text"
		value={$selectedStore[$selectedStore.length - 1].legends[3]}
		on:input={(e) => updateLegend(3, e)}
	/>
	<input
		name="legend"
		type="text"
		value={$selectedStore[$selectedStore.length - 1].legends[4]}
		on:input={(e) => updateLegend(4, e)}
	/>
	<input
		name="legend"
		type="text"
		value={$selectedStore[$selectedStore.length - 1].legends[5]}
		on:input={(e) => updateLegend(5, e)}
	/>
</div>
<div class="input-row">
	<input
		name="legend"
		type="text"
		value={$selectedStore[$selectedStore.length - 1].legends[6]}
		on:input={(e) => updateLegend(6, e)}
	/>
	<input
		name="legend"
		type="text"
		value={$selectedStore[$selectedStore.length - 1].legends[7]}
		on:input={(e) => updateLegend(7, e)}
	/>
	<input
		name="legend"
		type="text"
		value={$selectedStore[$selectedStore.length - 1].legends[8]}
		on:input={(e) => updateLegend(8, e)}
	/>
</div>
<div class="input-row">
	<input
		name="legend"
		type="text"
		value={$selectedStore[$selectedStore.length - 1].legends[9]}
		on:input={(e) => updateLegend(9, e)}
	/>
	<input
		name="legend"
		type="text"
		value={$selectedStore[$selectedStore.length - 1].legends[10]}
		on:input={(e) => updateLegend(10, e)}
	/>
	<input
		name="legend"
		type="text"
		value={$selectedStore[$selectedStore.length - 1].legends[11]}
		on:input={(e) => updateLegend(11, e)}
	/>
</div>

<style>
	.input-row {
		display: flex;
		width: 100%;
		gap: 10px;
		margin-bottom: 4px;
	}
</style>
