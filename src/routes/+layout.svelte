<script lang="ts">
	import { page } from "$app/stores";
	import { onKeyDown } from "$lib/keybindManager";
	import { initializeStandardKeybinds } from "$lib/standardKeybinds";
	import { onMount } from "svelte";

	let href = "";
	$: href = $page.url != undefined ? $page.url.href : "";

	onMount(() => {
		initializeStandardKeybinds();
	});
</script>

<svelte:head>
	<meta property="og:image" content={`${href}og-image.png`} />
</svelte:head>

<svelte:window on:keydown={onKeyDown} />
<main>
	<slot></slot>
</main>
