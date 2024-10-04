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
		IconX
	} from "@tabler/icons-svelte";
	import {
		exportKLEJson,
		exportProject,
		openKLEJson,
		openKLERawData,
		openProjectFile,
	} from "$lib";
	import {
		offset,
		flip,
		shift,
		type ComputePositionConfig,
	} from "svelte-floating-ui/dom";
	import { createFloatingActions } from "svelte-floating-ui";
	import { convertKLEArrayToRawDataString, serializeKeyMuseJSONToKLERawData } from "$lib/util";

	let popoverOptions: Partial<ComputePositionConfig> = {
		strategy: "absolute",
		placement: "bottom",
		middleware: [offset(12), flip(), shift()],
	};
	let showImportMenu = false;
	let importMenuParent: HTMLElement;
	let importMenuButton: HTMLElement;
	let showExportMenu = false;
	let exportMenuParent: HTMLElement;
	let exportMenuButton: HTMLElement;

	function windowClick(e: MouseEvent) {
		if (
			importMenuParent != e.target &&
			!importMenuParent?.contains(e.target as HTMLElement) &&
			importMenuButton != e.target &&
			!importMenuButton?.contains(e.target as HTMLElement)
		)
			showImportMenu = false;
		if (
			exportMenuParent != e.target &&
			!exportMenuParent?.contains(e.target as HTMLElement) &&
			exportMenuButton != e.target &&
			!exportMenuButton?.contains(e.target as HTMLElement)
		)
			showExportMenu = false;
	}

	const [importMenuRef, importMenuContent] =
		createFloatingActions(popoverOptions);
	const [exportMenuRef, exportMenuContent] =
		createFloatingActions(popoverOptions);

	let showImportKLERaw = false;
	let showExportKLERaw = false;
	let importTextArea: HTMLTextAreaElement;
	let exportTextArea: HTMLTextAreaElement;
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
	<button
		on:click={() => (showExportMenu = !showExportMenu)}
		use:exportMenuRef
		bind:this={exportMenuButton}><IconFileExport></IconFileExport></button
	>
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
			<button
				class={"popover-menu-button"}
				on:click={() => (showImportKLERaw = true)}
				><IconCode></IconCode>KLE Raw Data</button
			>
		</div>
	{/if}
	{#if showExportMenu}
		<div
			class="popover-menu"
			use:exportMenuContent
			bind:this={exportMenuParent}
		>
			<p class="popover-title">Export</p>
			<div class="popover-divider"></div>
			<button class={"popover-menu-button"} on:click={exportProject}
				><i class="hi-keyboard"></i>KeyMuse JSON</button
			>
			<button class={"popover-menu-button"} on:click={exportKLEJson}
				><IconCodeDots></IconCodeDots>KLE JSON</button
			>
			<button class={"popover-menu-button"}
			on:click={()=> {
				showExportKLERaw = true;
				exportTextArea.value = convertKLEArrayToRawDataString(serializeKeyMuseJSONToKLERawData($projectFile));
			}}
				><IconCode></IconCode>KLE Raw Data</button
			>
		</div>
	{/if}
	<div class="divider"></div>
	<div class="project-details">
		<i class="hi-keyboard"></i>{$projectFile.name}
	</div>
</div>
{#if showImportKLERaw}
	<div class="popover-menu popover-modal">
		<h1 class="popover-title">Import KLE Raw Data</h1>
		<button class="popover-close" on:click={()=>showImportKLERaw = false}><IconX></IconX></button>
		<div class="popover-divider"></div>
		<textarea
			bind:this={importTextArea}
			name="rawdata"
			id=""
			placeholder="Place KLE Raw data here..."
		></textarea>
		<div class="horizontal">
			<button
				class="popover-menu-button"
				on:click={() => (showImportKLERaw = false)}>Cancel</button
			><button
				class="button-primary popover-menu-button"
				on:click={() => {
					showImportKLERaw = false;
					openKLERawData(importTextArea.value);
				}}>Import</button
			>
		</div>
	</div>
{/if}
<div class="popover-menu popover-modal" class:hidden={!showExportKLERaw}>
	<h1 class="popover-title">Export KLE Raw Data</h1>
	<button class="popover-close" on:click={()=>showExportKLERaw = false}><IconX></IconX></button>
	<div class="popover-divider"></div>
	<p>Copy and paste the text below into KLE.</p>
	<textarea
		bind:this={exportTextArea}
		name="rawdata"
		id=""
		placeholder="KLE Raw data."
		readonly
	></textarea>
	<div class="horizontal">
		<button
			class="button-primary popover-menu-button"
			on:click={() => {
				exportTextArea.focus();
				exportTextArea.select();
				document.execCommand("copy");
			}}>Copy</button
		>
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
	textarea {
		font-family: "Jetbrains Mono", monospace;
		width: 100vw;
		max-width: min(400px, calc(100vw - 24px));
		height: 250px;
	}
	.horizontal {
		display: flex;
		gap: 8px;
		flex-grow: 0;
		justify-content: right;
	}
	.popover-modal .popover-menu-button {
		font-size: 16px;
		padding: 0 12px !important;
		flex-grow: 0;
		width: 100px !important;
		text-align: center;
		display: flex;
		align-items: center;
		justify-content: center !important;
	}
	.hidden {
		display: none;
		pointer-events: none;
		visibility: hidden;
	}
	.popover-close {
		position: absolute;
		top: 0;
		right: 0;
		opacity: 0.5;
	}
	.popover-close:hover {
		opacity: 1;
	}
	.popover-close {
		background: transparent !important;
	}
</style>
