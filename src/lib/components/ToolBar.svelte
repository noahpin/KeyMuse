<script>
	import CapAddIcon from "./CapAddIcon.svelte";
    import { toolStore } from "$lib";

</script>
<div id="toolbar-panel" class="ui-floating-element" >
    <button class={$toolStore == "select" ? "active" : ""} on:click={()=>toolStore.set("select")}><i class="hi-marquee"></i></button>
    <button class={$toolStore == "placement" ? "active" : ""} on:click={()=>toolStore.set("placement")}><i class="hi-plus-large"></i></button>
    <button class={$toolStore == "rotate" ? "active" : ""} on:click={()=>toolStore.set("rotate")}><i class="hi-rotate-right"></i></button>
</div>

<style>
	#toolbar-panel {
		top: 12px;
		left: 12px;
		z-index: 100;
		box-sizing: border-box;
        display: flex;
        flex-direction: column;
        gap: 4px
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
    }
    button:hover {
        background: var(--ui-light-gray);
    }
    button:active ,  button.active{
        background: #2172ff;
        color: white;
    }
</style>
