<script lang="ts">
	export let selectedStore: any;
</script>

<div id="properties-panel" class="ui-floating-element">
	<h1>Properties</h1>
	<div>
		{#if $selectedStore !== null}
			{#if Array.isArray($selectedStore)}
				<p>Multiple Caps Selected</p>
			{:else}
				<p>Single Cap Selected</p>
				<div>
					<input
						type="text"
						value={$selectedStore.legends}
						on:input={(e) => {
							$selectedStore.legends = e.target.value;
						}}
					/>
					<input
						type="text"
						value={$selectedStore.x}
						on:input={(e) => {
							$selectedStore.x = e.target.value;
						}}
					/>
					<input
						type="text"
						value={$selectedStore.y}
						on:input={(e) => {
							$selectedStore.y = e.target.value;
						}}
					/>
					<input
						type="text"
						value={$selectedStore.width}
						on:input={(e) => {
							$selectedStore.width = e.target.value;
						}}
					/>
					<input
						type="text"
						value={$selectedStore.height}
						on:input={(e) => {
							$selectedStore.height = e.target.value;
						}}
					/>
					<input
						type="text"
						value={$selectedStore.x2}
						on:input={(e) => {
							$selectedStore.x2 = e.target.value;
						}}
					/>
					<input
						type="text"
						value={$selectedStore.y2}
						on:input={(e) => {
							$selectedStore.y2 = e.target.value;
						}}
					/>
					<input
						type="text"
						value={$selectedStore.width2}
						on:input={(e) => {
							$selectedStore.width2 = e.target.value;
						}}
					/>
					<input
						type="text"
						value={$selectedStore.height2}
						on:input={(e) => {
							$selectedStore.height2 = e.target.value;
						}}
					/>
					<input type="color" value={$selectedStore.color} on:input={(e)=>{
						$selectedStore.color = e.target.value;
					
					}}/>
				</div>
			{/if}
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
