<script lang="ts">
	export let selectedStore: any;
	function updateProperty(property: string, value: any) {
		let temp = [...$selectedStore]
		temp.forEach((cap: any) => {
			cap[property] = value;
		});
		selectedStore.set(temp);
	}
</script>

<div id="properties-panel" class="ui-floating-element">
	<h1>Properties</h1>
	<div>
		{#if $selectedStore.length != 0}
			<div>
				<input
					type="text"
					value={$selectedStore[$selectedStore.length - 1].legends}
					on:input={(e) => updateProperty("legends", e.target.value)}
				/>
				<input
					type="number"
					step=".25"
					value={$selectedStore[$selectedStore.length - 1].x}
					on:input={(e) => updateProperty("x", e.target.value)}
				/>
				<input
					type="number"
					step=".25"
					value={$selectedStore[$selectedStore.length - 1].y}
					on:input={(e) => updateProperty("y", e.target.value)}
				/>
				<input
					type="number"
					step=".25"
					value={$selectedStore[$selectedStore.length - 1].width}
					on:input={(e) => updateProperty("width", e.target.value)}
				/>
				<input
					type="number"
					step=".25"
					value={$selectedStore[$selectedStore.length - 1].height}
					on:input={(e) => updateProperty("height", e.target.value)}
				/>
				<input
					type="number"
					step=".25"
					value={$selectedStore[$selectedStore.length - 1].x2}
					on:input={(e) => updateProperty("x2", e.target.value)}
				/>
				<input
					type="number"
					step=".25"
					value={$selectedStore[$selectedStore.length - 1].y2}
					on:input={(e) => updateProperty("y2", e.target.value)}
				/>
				<input
					type="number"
					step=".25"
					value={$selectedStore[$selectedStore.length - 1].width2}
					on:input={(e) => updateProperty("width2", e.target.value)}
				/>
				<input
					type="number"
					step=".25"
					value={$selectedStore[$selectedStore.length - 1].height2}
					on:input={(e) => updateProperty("height2", e.target.value)}
				/>
				<input
					type="color"
					value={$selectedStore[$selectedStore.length - 1].color}
					on:input={(e) => updateProperty("color", e.target.value)}
				/>
			</div>
			<pre>{JSON.stringify($selectedStore, null, 2)}</pre>
		{:else}
			<p>No Cap Is Selected</p>
		{/if}
	</div>
</div>

<style>
	#properties-panel {
		top: 12px;
		right: 12px;
		width: 300px;
		height: calc(100vh - 24px);
		z-index: 100;
		box-sizing: border-box;
	}
</style>
