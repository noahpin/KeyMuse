<script>
	import CapAddIcon from "./CapAddIcon.svelte";
    import { toolStore } from "$lib/stores";
    import {IconMarquee2, IconSquarePlus, IconRotateDot, IconArrowsMove, IconArrowBack, IconArrowForward} from "@tabler/icons-svelte";

</script>
<div id="toolbar-panel" class="ui-floating-element" >
    <button class={$toolStore == "select" ? "active" : ""} on:click={()=>toolStore.set("select")}><IconMarquee2 size={24}></IconMarquee2></button>
    <button class={$toolStore == "placement" ? "active" : ""} on:click={()=>toolStore.set("placement")}><IconSquarePlus size={24}></IconSquarePlus></button>
    <button class={$toolStore == "rotate" ? "active" : ""} on:click={()=>toolStore.set("rotate")}><IconRotateDot size={24}></IconRotateDot></button>
    <button class={$toolStore == "translate" ? "active" : ""} on:click={()=>toolStore.set("translate")}><IconArrowsMove size={24}></IconArrowsMove></button>
    <div class="divider"></div>
    <button disabled on:click={()=>toolStore.set("rotate")}><IconArrowBack></IconArrowBack></button>
    <button disabled on:click={()=>toolStore.set("rotate")}><IconArrowForward></IconArrowForward></button>
</div>

<style>
	#toolbar-panel {
		top: 80px;
		left: 12px;
		z-index: 100;
		box-sizing: border-box;
        display: flex;
        flex-direction: column;
        gap: 4px;
        align-items: center;
	}
    .divider {
        width: 34px; height: 1px; background: var(--ui-light-gray)
    }
    button{
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
    button:hover {
        background: var(--ui-light-gray);
    }
    button:active ,  button.active{
        background: var(--accent);
        color: white;
        fill: white !important;
    }
</style>
