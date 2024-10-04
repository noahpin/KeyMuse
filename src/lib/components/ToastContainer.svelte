<script lang="ts">
	import ToastMessage from "./ToastMessage.svelte";
	import { toastMessages } from "$lib/stores";
</script>

<div id="toast-container">
	{#each $toastMessages as message, i}
		<ToastMessage data={message.toast} index={i} id={message.id} />
	{/each}
</div>

<style>
	#toast-container {
		top: 80px;
		left: 80px;
		z-index: 200;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;

		position: absolute;
	}
</style>
