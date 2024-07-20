<script lang="ts">
	import {
		updateCapData,
		selectedStore,
		projectFile,
		propertyPanelStore,
		alignCapsToGrid,
		logData,
		parseCapColor,
		getWhiteOrBlackFromColor,
		createVariable,
		variableDeletionStore,
	} from "$lib";
	import ColorVariable from "./ColorVariable.svelte";
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

	function setColorToVariable(prop: string, val: string) {
		updateCapData($selectedStore, prop, val, false, false);
		if (prop == "textColor") textColor = val;
		if (prop == "color") capColor = val;
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
	let showTextColorVarPicker = false;
	let showCapColorVarPicker = false;
	function onwindowclick(e: MouseEvent) {
		if ((e.target as HTMLElement).classList.contains("color-variable-button"))
			return;
		showTextColorVarPicker = false;
		showCapColorVarPicker = false;
	}
</script>

<svelte:window on:click={onwindowclick} />

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
								value={$selectedStore[$selectedStore.length - 1].r}
								on:input={(e) => updateProperty("r", e)}
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
								<div class="color-side">
									<input
										name="capColor"
										type="color"
										value={parseCapColor(
											$selectedStore[$selectedStore.length - 1].color
										)}
										on:input={(e) => {
											updateProperty("color", e);
										}}
									/>
									<div
										class="preview"
										style={`background: ${parseCapColor(capColor)}`}
									></div>
								</div>
								<button
									on:click={(e) =>
										(showCapColorVarPicker = !showCapColorVarPicker)}
									class={"color-variable-button " +
										(capColor.startsWith("$") ? "variable-active" : "")}
									><i class="hi-book-open"></i></button
								>
							</div>
							{#if showCapColorVarPicker}
								<div class="color-input-variable-picker">
									{#each $projectFile.variables as variable}
										<button
											on:click={(e) =>
												setColorToVariable("color", "$" + variable.id)}
											style={`background: ${variable.color}; color: ${getWhiteOrBlackFromColor(variable.color)}`}
											>{variable.displayName}</button
										>
									{/each}
								</div>
							{/if}
						</div>
						<div class="input-stack">
							<label for="textColor">Text Color</label>
							<div class="color-input">
								<div class="color-side">
									<input
										name="textColor"
										type="color"
										value={parseCapColor(
											$selectedStore[$selectedStore.length - 1].textColor
										)}
										on:input={(e) => {
											updateProperty("textColor", e);
										}}
									/>
									<div
										class="preview"
										style={`background: ${parseCapColor(textColor)}`}
									></div>
								</div>
								<button
									on:click={(e) =>
										(showTextColorVarPicker = !showTextColorVarPicker)}
									class={"color-variable-button " +
										(textColor.startsWith("$") ? "variable-active" : "")}
									><i class="hi-book-open"></i></button
								>
							</div>
							{#if showTextColorVarPicker}
								<div class="color-input-variable-picker">
									{#each $projectFile.variables as variable}
										<button
											on:click={(e) =>
												setColorToVariable("textColor", "$" + variable.id)}
											style={`background: ${variable.color}; color: ${getWhiteOrBlackFromColor(variable.color)}`}
											>{variable.displayName}</button
										>
									{/each}
								</div>
							{/if}
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
	<h1>Variables</h1>
	<div class="button-grid">
		{#key $variableDeletionStore}
			{#each $projectFile.variables as variable}
				<ColorVariable {variable}></ColorVariable>
			{/each}
		{/key}
		<button class="shallow-button" on:click={createVariable}
			><i class="hi-plus-large"></i></button
		>
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
		position: relative;
	}
	label {
		padding: 0 4px;
	}
	button.color-variable-button {
		width: 30px;
		flex-basis: 30px;
		height: 30px;
		flex-shrink: 0;
		border: none;
		background: none;
		padding: 0 !important;
		border-radius: 0;
		border-left: 1px solid var(--ui-transparent-outline);
		display: flex;
		justify-content: center;
		align-items: center;
		color: var(--secondary-text);
	}
	button.color-variable-button i {
		pointer-events: none;
	}
	button.variable-active {
		color: white;
		background: var(--accent);
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

	.shallow-button {
		padding: 0;
		background: none;
		opacity: 0.75;
	}
	.shallow-button:hover {
		background: var(--ui-element-background);
		opacity: 1;
	}

	.button-grid {
		display: flex;
		justify-content: space-between;
		gap: 8px;
		flex-wrap: wrap;
	}

	.color-input-variable-picker {
		position: absolute;
		top: 56px;
		right: 0;
		z-index: 100000;
		background: white;
		border-radius: 10px;
		border: 1px solid var(--ui-transparent-outline);
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.233);
		padding: 6px;
		display: flex;
		gap: 4px;
		flex-direction: column;
		width: 150px;
	}
	.color-input-variable-picker button {
		width: 100%;
		text-wrap: nowrap;
		overflow: hidden;
	}
</style>
