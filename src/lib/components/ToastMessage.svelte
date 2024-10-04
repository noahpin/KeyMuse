<script lang="ts">
	import { removeToastMessage } from "$lib";
	import { IconX, IconExclamationMark, IconCheck } from "@tabler/icons-svelte";
	import { onMount } from "svelte";
	import { fade } from "svelte/transition";
	import { spring } from "svelte/motion";
	export let data: ToastMessage;
	export let index: number;
	export let id: string;
	let height = spring(index * 66, { precision: 0.001 });
	// $: height.set(index * 66);
	$: console.log(index);
	$: console.log($height);
	onMount(() => {
		console.log(data);
		setTimeout(() => {
			removeToastMessage(id);
		}, data.duration);
	});
</script>

<div
	class={"ui-floating-element toast-message toast-" + data.style}
	style:transform={`translateY(${$height}px)`}
	transition:fade={{ duration: 300 }}
>
	{#if data.style == "error"}
		<IconX></IconX>
	{/if}
	{#if data.style == "warning"}
		<IconExclamationMark></IconExclamationMark>
	{/if}
	{#if data.style == "success"}
		<IconCheck></IconCheck>
	{/if}

	{data.message}
</div>

<style>
	.toast-message {
		padding: 12px;
		height: 54px;
		display: flex;
		justify-content: left;
		align-items: center;
		width: fit-content;
		text-wrap: nowrap;
		box-sizing: border-box;
		gap: 10px;
		min-width: 160px;
	}
	.toast-warning {
		background: linear-gradient(
			to right,
			rgb(255, 238, 170),
			var(--ui-bg) 100px,
			var(--ui-bg)
		);
	}
	.toast-error {
		background: linear-gradient(
			to right,
			rgb(255, 194, 194),
			var(--ui-bg) 100px,
			var(--ui-bg)
		);
	}
	.toast-success {
		background: linear-gradient(
			to right,
			rgb(225, 255, 229),
			var(--ui-bg) 100px,
			var(--ui-bg)
		);
	}
</style>
