<script lang="ts">
	import {
		updateCapData,
		selectedStore,
		layoutFile,
		propertyPanelStore,
	} from "$lib";
	function updateProperty(property: string, event: Event | null) {
		if (!event?.target) return;
		updateCapData(
			$selectedStore,
			property,
			(event.target as HTMLInputElement).type == "checkbox"
				? (event.target as HTMLInputElement).checked
				: (event.target as HTMLInputElement).value,
			false,
			false
		);
	}
	function logData() {
		console.log($layoutFile);
	}
</script>

<div id="properties-panel" class="ui-floating-element">
	<h1>Properties</h1>
	<div>
		{#if $selectedStore.length != 0}
			<div>
				{#key $propertyPanelStore}
					legend:
					<br />
					<input
						type="text"
						value={$selectedStore[$selectedStore.length - 1].legends}
						on:input={(e) => updateProperty("legends", e)}
					/>
					<br />
					x:
					<br />
					<input
						type="number"
						step=".25"
						value={$selectedStore[$selectedStore.length - 1].x}
						on:input={(e) => updateProperty("x", e)}
					/>
					<br />
					y:
					<br />
					<input
						type="number"
						step=".25"
						value={$selectedStore[$selectedStore.length - 1].y}
						on:input={(e) => updateProperty("y", e)}
					/>
					<br />
					w:
					<br />
					<input
						type="number"
						step=".25"
						value={$selectedStore[$selectedStore.length - 1].w}
						on:input={(e) => updateProperty("w", e)}
					/>
					<br />
					h:
					<br />
					<input
						type="number"
						step=".25"
						value={$selectedStore[$selectedStore.length - 1].h}
						on:input={(e) => updateProperty("h", e)}
					/>
					<br />
					secondary x:
					<br />
					<input
						type="number"
						step=".25"
						value={$selectedStore[$selectedStore.length - 1].x2}
						on:input={(e) => updateProperty("x2", e)}
					/>
					<br />
					secondary y:
					<br />
					<input
						type="number"
						step=".25"
						value={$selectedStore[$selectedStore.length - 1].y2}
						on:input={(e) => updateProperty("y2", e)}
					/>
					<br />
					secondary w:
					<input
						type="number"
						step=".25"
						value={$selectedStore[$selectedStore.length - 1].w2}
						on:input={(e) => updateProperty("w2", e)}
					/>
					<br />
					secondary h:
					<input
						type="number"
						step=".25"
						value={$selectedStore[$selectedStore.length - 1].h2}
						on:input={(e) => updateProperty("h2", e)}
					/>
					<br />
					angle:
					<input
						type="number"
						step=".25"
						value={$selectedStore[$selectedStore.length - 1].angle}
						on:input={(e) => updateProperty("angle", e)}
					/>
					<br />
					cap color:
					<input
						type="color"
						value={$selectedStore[$selectedStore.length - 1].color}
						on:input={(e) => updateProperty("color", e)}
					/>
					<br />
					font color:
					<input
						type="color"
						value={$selectedStore[$selectedStore.length - 1].fontColor}
						on:input={(e) => updateProperty("fontColor", e)}
					/>
					<br />
					stepped:
					<input
						type="checkbox"
						checked={$selectedStore[$selectedStore.length - 1].stepped}
						on:input={(e) => updateProperty("stepped", e)}
					/>
				{/key}
			</div>
			<!-- {#key $layoutFile}
				<pre>{JSON.stringify($selectedStore, null, 2)}</pre>{/key} -->
		{:else}
			<p>No Cap Is Selected</p>
		{/if}
	</div>
	<button on:click={logData}>log data</button>
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
