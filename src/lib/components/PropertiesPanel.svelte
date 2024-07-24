<script lang="ts">
	import {
		updateCapData,
		alignCapsToGrid,
		logData,
		parseCapColor,
		getWhiteOrBlackFromColor,
		createVariable,
	} from "$lib";
	import {
		selectedStore,
		projectFile,
		propertyPanelStore,
		variableDeletionStore,
	} from "$lib/stores";
	import ColorVariable from "./ColorVariable.svelte";
	import {
		offset,
		flip,
		shift,
		type ComputePositionConfig,
	} from "svelte-floating-ui/dom";
	import { createFloatingActions } from "svelte-floating-ui";
	import {
		TrFillLayoutSidebarRightCollapse,
		TrFillLayoutSidebarRightExpand,
	} from "svelte-icons-pack/tr";
	import { Icon } from "svelte-icons-pack";
	import { spring } from "svelte/motion";
	import { lerp } from "$lib/util";
	let options: Partial<ComputePositionConfig> = {
		strategy: "absolute",
		placement: "bottom",
		middleware: [offset(6), flip(), shift()],
	};
	const [floatingCapRef, floatingCapContent] = createFloatingActions(options);
	const [floatingTextRef, floatingTextContent] = createFloatingActions(options);

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
	let textColorButton: HTMLElement;
	let capColorButton: HTMLElement;
	let showTextColorVarPicker = false;
	let showCapColorVarPicker = false;
	function onwindowclick(e: MouseEvent) {
		let cl = (e.target as HTMLElement).classList;
		if (
			cl.contains("color-input-variable-picker") ||
			cl.contains("picker-button")
		)
			return;
		if (e.target != textColorButton) showTextColorVarPicker = false;
		if (e.target != capColorButton) showCapColorVarPicker = false;
	}

	let panelCollapsed = false;

	let windowW = 0;
	let windowH = 0;

	$: breakpoint = 750 > windowW;

	let snapPointOpen = -600;
	let snapPointClosed = -75;

	let sheetPositionStore = spring(snapPointClosed);

	let sheetEl: HTMLElement;
	let doSheetMove = false;

	var sheetBarIdleState = { m: 6, e: 6 };
	var sheetBarHoverOpenState = { m: 2.5, e: 9.5 };
	var sheetBarHoverCloseState = { m: 9.5, e: 2.5 };

	var sheetBarSpring = spring(sheetBarIdleState);

	function sheetBarOver() {
		sheetBarSpring.set(
			sheetOpen ? sheetBarHoverCloseState : sheetBarHoverOpenState
		);
	}
	function sheetBarOut() {
		sheetBarSpring.set(sheetBarIdleState);
	}

	let startY = 0;
	let prevY = 0;
	let sheetOpen = false; //false means closed
	function toggleSheetOpen() {
		sheetOpen = !sheetOpen;

		let next = sheetOpen ? snapPointOpen : snapPointClosed;
		sheetPositionStore.set(next);
	}
	function touchStartHandler(e: TouchEvent) {
		prevY = startY = e.touches[0].clientY;
	}
	let rawNPos = 0;
	let yWhenOverTop: number | null = null;
	function touchMoveHandler(e: TouchEvent) {
		let dY = prevY - e.touches[0].clientY;
		if (sheetOpen) {
			if (sheetEl.scrollTop == 0 && dY < 0) doSheetMove = true;
		} else {
			doSheetMove = true;
		}
		if (doSheetMove) {
			e.preventDefault();
		} else {
			doSheetMove = false;
			prevY = e.touches[0].clientY;
			return;
		}
		let nPos = $sheetPositionStore - dY;
		rawNPos = nPos;
		if(nPos < snapPointOpen) {
			if(yWhenOverTop == null) yWhenOverTop = e.touches[0].clientY
			let diff = yWhenOverTop - e.touches[0].clientY;
			nPos = snapPointOpen - lerp(diff, 0, 0.65);
		}
		sheetPositionStore.set(nPos, {
			hard: true,
		});
		prevY = e.touches[0].clientY;
		doSheetMove = false;
	}

	function touchEndHandler(e: TouchEvent) {
		let cur = sheetOpen ? snapPointOpen : snapPointClosed;
		let next = sheetOpen ? snapPointClosed : snapPointOpen;
		let thresh = Math.abs(next - cur) * 0.15;
		yWhenOverTop= null;
		if (Math.abs($sheetPositionStore - cur) > thresh) {
			sheetOpen = !sheetOpen;
			sheetPositionStore.set(next);
		} else {
			sheetPositionStore.set(cur);
		}
	}
</script>

<svelte:window
	on:click={onwindowclick}
	bind:innerWidth={windowW}
	bind:innerHeight={windowH}
/>
<div
	id="properties-panel-toggle"
	class={"ui-floating-element " + (panelCollapsed ? "" : "panel-off")}
>
	<button
		on:click={() => {
			panelCollapsed = false;
		}}><Icon src={TrFillLayoutSidebarRightExpand} size="24"></Icon></button
	>
</div>
<div
	on:touchstart={touchStartHandler}
	on:touchmove={touchMoveHandler}
	on:touchend={touchEndHandler}
	id="properties-panel"
	
	style={breakpoint ? `transform: translateY(${$sheetPositionStore}px);` : ""}
	class={"ui-floating-element " + (panelCollapsed ? "panel-off" : "")}
>
	<h1>
		Properties

		{#if breakpoint}
			<button
				class="sheet-topline-button"
				on:click={toggleSheetOpen}
				on:pointerenter={sheetBarOver}
				on:pointerout={sheetBarOut}
			>
				<svg class="sheet-topline" viewBox="0 0 50 12">
					<path
						d={`M 2.5 ${$sheetBarSpring.e} L 25 ${$sheetBarSpring.m} L 47.6 ${$sheetBarSpring.e}`}
						fill="none"
						stroke="var(--ui-gray)"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="5"
					></path>
				</svg>
			</button>
		{/if}
		{#if !breakpoint}
			<button
				class="toggle-collapse"
				on:click={() => {
					panelCollapsed = true;
				}}
				><Icon src={TrFillLayoutSidebarRightCollapse} size="24"></Icon></button
			>{/if}
	</h1>
	<div class="properties-panel-scroll"
	bind:this={sheetEl}>
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
										bind:this={capColorButton}
										use:floatingCapRef
										on:click={(e) =>
											(showCapColorVarPicker = !showCapColorVarPicker)}
										class={"color-variable-button " +
											(capColor.startsWith("$") ? "variable-active" : "")}
										><i class="hi-book-open"></i></button
									>
								</div>
								{#if showCapColorVarPicker}
									<div
										class="color-input-variable-picker"
										use:floatingCapContent
									>
										{#each $projectFile.variables as variable}
											<button
												class={"picker-button " +
													(capColor == "$" + variable.id ? "active" : "")}
												on:click={(e) =>
													setColorToVariable("color", "$" + variable.id)}
											>
												<div
													class="swatch"
													style={`background: ${variable.color};`}
												></div>
												{variable.displayName}</button
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
										bind:this={textColorButton}
										use:floatingTextRef
										on:click={(e) =>
											(showTextColorVarPicker = !showTextColorVarPicker)}
										class={"color-variable-button " +
											(textColor.startsWith("$") ? "variable-active" : "")}
										><i class="hi-book-open"></i></button
									>
								</div>
								{#if showTextColorVarPicker}
									<div
										class="color-input-variable-picker"
										use:floatingTextContent
									>
										{#each $projectFile.variables as variable}
											<button
												class={"picker-button " +
													(textColor == "$" + variable.id ? "active" : "")}
												on:click={(e) =>
													setColorToVariable("textColor", "$" + variable.id)}
											>
												<div
													class="swatch"
													style={`background: ${variable.color};`}
												></div>
												{variable.displayName}</button
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
		<h2>Variables</h2>
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
		<h2>Actions</h2>
		<div class="button-grid">
			<button on:click={logData}>Log Data</button>
			<button on:click={alignCapsToGrid}>Align to Grid</button>
		</div>
	</div>
</div>

<style>
	#properties-panel-toggle {
		top: 12px;
		right: 12px;
		z-index: 80;
		box-sizing: border-box;
		transition: 0.3s;
	}

	#properties-panel-toggle button,
	.toggle-collapse {
		background: none;
		outline: none;
		border: none;
		margin: 0;
		padding: 0;
		width: 40px;
		height: 40px;
		border-radius: 4px;
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--main-text);
	}
	#properties-panel-toggle button:hover,
	.toggle-collapse:hover {
		background: var(--ui-light-gray);
	}
	#properties-panel-toggle button:active,
	.toggle-collapse:active {
		background: var(--accent);
		color: white;
	}
	.toggle-collapse {
		position: absolute;
		right: -4px;
		top: 8px;
	}
	#properties-panel {
		top: 12px;
		right: 12px;
		width: 300px;
		height: calc(100vh - 24px);
		z-index: 200;
		box-sizing: border-box;
		padding: 0px 12px;
		transition:
			0.3s opacity,
			0.3s transform;
		display: flex;
		flex-direction: column;
	}

	.panel-off {
		transform: translateX(100%);
		opacity: 0;
		pointer-events: none;
	}

	.properties-panel-scroll {
		height: 100%;
		width: 100%;
		overflow-y: auto;
		overflow-x: hidden;
		padding-bottom: 60px;
	}

	@media screen and (max-width: 750px) {
		#properties-panel {
			width: 100vw;
			max-width: min(450px, calc(100vw - 24px));
			top: unset;
			height: 700px;
			padding-bottom: 100px;
			top: 100%;
			border-bottom-right-radius: 0;
			border-bottom-left-radius: 0;
			transition: unset;
		}
		#properties-panel h1 {
			padding-top: 19px !important;
		}
	}
	.sheet-topline-button {
		position: absolute;
		left: 50%;
		transform: translate(-50%);
		top: 5px;
		z-index: 9999;
		margin-bottom: -20px;
		height: 20px;
		padding: 0;
		background: transparent;
		border: none;
		border-radius: 0;
		overflow: visible;
		width: 70px;
	}
	.sheet-topline {
		width: 50px;
		height: 12px;
		pointer-events: none;
	}

	#properties-panel h1 {
		padding-bottom: 11px;
		padding-top: 14px;
		border-bottom: 1px solid var(--ui-light-gray);
		margin-top: 0px;
		margin-bottom: 0;
		font-weight: bold;
		font-size: 1.6em;
		position: sticky;
		top: 0;
		z-index: 1000;
		background-color: white;
	}
	#properties-panel h2 {
		padding-bottom: 6px;
		border-bottom: 1px solid var(--ui-light-gray);
		margin-top: 18px;
		font-weight: 500;
		font-size: 1.3em;
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
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 4px;
		height: 36px;
		box-sizing: border-box;
		flex-shrink: 0;
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
	.picker-button {
		justify-content: left;
		gap: 8px;
		min-height: 36px;
	}
	.picker-button.active {
		border: 1px solid var(--accent);
		background: var(--accent-light);
	}
	.swatch {
		box-sizing: border-box;
		width: 20px;
		height: 20px;
		border-radius: 2px;
		border: 1px solid var(--ui-transparent-outline);
	}
</style>
