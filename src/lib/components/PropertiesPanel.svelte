<script lang="ts">
	import {
		updateCapData,
		selectedStore,
		projectFile,
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
		if (property == "textColor")
			textColor = (event.target as HTMLInputElement).value;
		if (property == "color")
			capColor = (event.target as HTMLInputElement).value;
	}

	function alignCapsToGrid() {
		$selectedStore.forEach((cap) => {
			let newX = Math.round(cap.x / 0.25) * 0.25;
			let newY = Math.round(cap.y / 0.25) * 0.25;
			updateCapData([cap], "x", newX);
			updateCapData([cap], "y", newY);
		});
	}
	function logData() {
		console.log($projectFile);
	}
	let textColor = "";
	let capColor = "";
	$: {
		capColor =
			$selectedStore.length > 0
				? $selectedStore[$selectedStore.length - 1].color
				: "";
		textColor =
			$selectedStore.length > 0
				? $selectedStore[$selectedStore.length - 1].textColor
				: "";
	}
</script>

<div id="properties-panel" class="ui-floating-element">
	<h1>Properties</h1>
	<div>
		{#if $selectedStore.length != 0}
			<div>
				{#key $propertyPanelStore}
					<div class="input-stack">
						<label for="legend">Legend</label>
						<input
							name="legend"
							type="text"
							value={$selectedStore[$selectedStore.length - 1].legends}
							on:input={(e) => updateProperty("legends", e)}
						/>
					</div>
					<div class="input-group">
						<div class="input-pair">
							<div class="input-stack">
								<label for="xPosition">X</label>
								<input
									name="xPosition"
									type="number"
									step=".25"
									value={$selectedStore[$selectedStore.length - 1].x}
									on:input={(e) => updateProperty("x", e)}
								/>
							</div>
							<div class="input-stack">
								<label for="yPosition">Y</label>
								<input
									name="yPosition"
									type="number"
									step=".25"
									value={$selectedStore[$selectedStore.length - 1].y}
									on:input={(e) => updateProperty("y", e)}
								/>
							</div>
						</div>
						<div class="input-pair">
							<div class="input-stack">
								<label for="secondaryXPosition">X Offset</label>
								<input
									name="offsetXPosition"
									type="number"
									step=".25"
									value={$selectedStore[$selectedStore.length - 1].x2}
									on:input={(e) => updateProperty("x2", e)}
								/>
							</div>
							<div class="input-stack">
								<label for="secondaryXPosition">Y Offset</label>
								<input
									name="offsetYPosition"
									type="number"
									step=".25"
									value={$selectedStore[$selectedStore.length - 1].y2}
									on:input={(e) => updateProperty("y2", e)}
								/>
							</div>
						</div>
					</div>
					<div class="input-group">
						<div class="input-pair">
							<div class="input-stack">
								<label for="width">Width</label>
								<input
									name="width"
									type="number"
									step=".25"
									value={$selectedStore[$selectedStore.length - 1].w}
									on:input={(e) => updateProperty("w", e)}
								/>
							</div>
							<div class="input-stack">
								<label for="height">Height</label>
								<input
									name="height"
									type="number"
									step=".25"
									value={$selectedStore[$selectedStore.length - 1].h}
									on:input={(e) => updateProperty("h", e)}
								/>
							</div>
						</div>
						<div class="input-pair">
							<div class="input-stack">
								<label for="secondaryWidth">2nd Width</label>
								<input
									name="secondaryWidth"
									type="number"
									step=".25"
									value={$selectedStore[$selectedStore.length - 1].w2}
									on:input={(e) => updateProperty("w2", e)}
								/>
							</div>
							<div class="input-stack">
								<label for="secondaryHeight">2nd Height</label>
								<input
									name="secondaryHeight"
									type="number"
									step=".25"
									value={$selectedStore[$selectedStore.length - 1].h2}
									on:input={(e) => updateProperty("h2", e)}
								/>
							</div>
						</div>
					</div>
					<div class="input-group">
						<div class="input-stack">
							<label for="angle">Angle</label>
							<input
								name="angle"
								type="number"
								value={$selectedStore[$selectedStore.length - 1].angle}
								on:input={(e) => updateProperty("angle", e)}
							/>
						</div>
						<div class="input-stack">
							<label for="stepped">Stepped</label>
							<input
								name="stepped"
								type="checkbox"
								value={$selectedStore[$selectedStore.length - 1].stepped}
								on:input={(e) => updateProperty("stepped", e)}
							/>
						</div>
					</div>

					<div class="input-group">
						<div class="input-stack">
							<label for="capColor">Cap Color</label>
							<div class="color-input">
								<input
									name="capColor"
									type="color"
									value={$selectedStore[$selectedStore.length - 1].color}
									on:input={(e) => {
										updateProperty("color", e);
									}}
								/>
								<div class="preview" style={`background: ${capColor}`}></div>
							</div>
						</div>
						<div class="input-stack">
							<label for="textColor">Text Color</label>
							<div class="color-input">
								<input
									name="textColor"
									type="color"
									value={$selectedStore[$selectedStore.length - 1].textColor}
									on:input={(e) => {
										updateProperty("textColor", e);
									}}
								/>
								<div class="preview" style={`background: ${textColor}`}></div>
							</div>
						</div>
					</div>
				{/key}
			</div>
			<!-- {#key $projectFile}
				<pre>{JSON.stringify($selectedStore, null, 2)}</pre>{/key} -->
		{:else}
			<p>No Cap Is Selected</p>
		{/if}
	</div>
	<h1>Actions</h1>
	<div class="button-grid">
		<button on:click={logData}>Log Data</button>
		<button on:click={alignCapsToGrid}>Align to Grid</button>
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
		padding: 8px 12px !important;
	}
	#properties-panel h1 {
		padding-bottom: 6px;
		border-bottom: 1px solid var(--ui-light-gray);
		margin-top: 18px;
	}
	input {
		width: 100%;
		box-sizing: border-box;
		outline: none;
		border: none;
		padding: 5px 8px;
		border-radius: 4px;
		background: var(--ui-element-background);
		border: 1px solid var(--ui-transparent-outline);
	}
	.input-group {
		width: 100%;
		display: flex;
		flex-wrap: nowrap;
		gap: 10px;
		align-items: center;
	}
	.input-pair {
		display: flex;
		width: 100%;
		flex-direction: column;
	}
	.input-stack {
		display: flex;
		width: 100%;
		flex-direction: column;
		gap: 3px;
		margin-top: 12px;
	}
	label {
		padding: 0 4px;
	}
	button {
		padding: 8px 12px;
		margin: 0;
		box-sizing: border-box;
		font-size: 16px;
		background: var(--ui-element-background);
		border: none;
		border-radius: 4px;
		cursor: pointer;
		border: 1px solid var(--ui-transparent-outline);
		flex-basis: 40%;
		flex-grow: 1;
	}
	.button-grid {
		display: flex;
		justify-content: space-between;
		gap: 8px;
		flex-wrap: wrap;
	}
	input:hover,
	button:hover {
		background: var(--ui-light-gray);
	}
	.color-input {
		position: relative;
		width: 100%;
		box-sizing: border-box;
		outline: none;
		border: none;
		border-radius: 4px;
		background: var(--ui-element-background);
	}
	input[type="color"] {
		opacity: 0;
	}
	.color-input .preview {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		z-index: 1000;
		pointer-events: none;
		border-radius: 4px;
		border: 1px solid white;
		border: 1px solid var(--ui-transparent-outline);
	}
</style>
