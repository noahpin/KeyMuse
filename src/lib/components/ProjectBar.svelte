<script lang="ts">
	import { toolStore, projectAction, projectFile } from "$lib/stores";
	import {
		IconHomeFilled,
		IconSettingsFilled,
		IconFileExport,
		IconFileImport,
		IconLayoutGridFilled,
		IconPokeball,
		IconCodeDots,
		IconCode,
	} from "@tabler/icons-svelte";
	import { exportProject, openKLEJson, openProjectFile } from "$lib";
	import {
		offset,
		flip,
		shift,
		type ComputePositionConfig,
	} from "svelte-floating-ui/dom";
	import { createFloatingActions } from "svelte-floating-ui";

	let popoverOptions: Partial<ComputePositionConfig> = {
		strategy: "absolute",
		placement: "bottom",
		middleware: [offset(12), flip(), shift()],
	};
	let showImportMenu = false;
	let importMenuParent: HTMLElement;
	let importMenuButton: HTMLElement;

	function windowClick(e: MouseEvent) {
		console.log(e.target);
		if (
			importMenuParent != e.target &&
			!importMenuParent.contains(e.target as HTMLElement) &&
			importMenuButton != e.target &&
			!importMenuButton.contains(e.target as HTMLElement)
		)
			showImportMenu = false;
	}

	const [importMenuRef, importMenuContent] =
		createFloatingActions(popoverOptions);
</script>

<svelte:window on:click={windowClick} />

<div id="toolbar-panel" class="ui-floating-element">
	<button disabled on:click={() => toolStore.set("rotate")}
		><IconLayoutGridFilled></IconLayoutGridFilled></button
	>
	<div class="divider"></div>
	<button on:click={() => projectAction.set("home")}
		><IconHomeFilled size={24}></IconHomeFilled></button
	>
	<button disabled on:click={() => toolStore.set("rotate")}
		><IconSettingsFilled size={24}></IconSettingsFilled></button
	>
	<button
		on:click={() => (showImportMenu = !showImportMenu)}
		use:importMenuRef
		bind:this={importMenuButton}><IconFileImport></IconFileImport></button
	>
	<button on:click={exportProject}><IconFileExport></IconFileExport></button>
	{#if showImportMenu}
		<div
			class="popover-menu"
			use:importMenuContent
			bind:this={importMenuParent}
		>
			<p class="popover-title">Import</p>
			<div class="popover-divider"></div>
			<button class={"popover-menu-button"} on:click={openProjectFile}
				><i class="hi-keyboard"></i>KeyMuse JSON</button
			>
			<button class={"popover-menu-button"} on:click={openKLEJson}
				><IconCodeDots></IconCodeDots>KLE JSON</button
			>
			<!-- <button class={"popover-menu-button"}
				><IconCode></IconCode>KLE Raw Data</button
			> -->
		</div>
	{/if}
	<div class="divider"></div>
	<div class="project-details">
		<i class="hi-keyboard"></i>{$projectFile.name}
	</div>
</div>

<style>
	#toolbar-panel {
		top: 12px;
		left: 12px;
		z-index: 100;
		box-sizing: border-box;
		display: flex;
		gap: 4px;
		align-items: center;
	}
	.divider {
		width: 1px;
		height: 34px;
		background: var(--ui-light-gray);
	}
	.project-details {
		--hi-accent: red;
		display: flex;
		gap: 8px;
		align-items: center;
		box-sizing: border-box;
		padding: 8px;
		color: var(--main-text);
		--hi-accent: var(--main-text);
		--hi-base: var(--ui-bg);
	}

	.hi-keyboard {
		color: var(--main-text);
		--hi-base: var(--ui-bg);
	}
	button {
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
		cursor: pointer;
	}
	button:hover {
		background: var(--ui-light-gray);
	}
	button:active {
		background: var(--accent);
		color: white;
	}
</style>
