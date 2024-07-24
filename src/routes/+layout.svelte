<script lang="ts">
	import { page } from "$app/stores";
	import { onKeyDown } from "$lib/keybindManager";
	import { initializeStandardKeybinds } from "$lib/standardKeybinds";
	import { onMount } from "svelte";

	onMount(() => {
		initializeStandardKeybinds();
	});
</script>

<svelte:head>
	<meta property="og:image" content={`${$page.url.href}og-image.png`} />
</svelte:head>

<svelte:window on:keydown={onKeyDown} />
<main>
	<slot></slot>
</main>
