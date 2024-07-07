<script>
	import CapAddIcon from "./CapAddIcon.svelte";
    import { toolStore } from "$lib";

</script>
<div id="toolbar-panel" class="ui-floating-element" >
    <button class={$toolStore == "select" ? "active" : ""} on:click={()=>toolStore.set("select")}><i class="hi-marquee"></i></button>
    <button class={$toolStore == "placement" ? "active" : ""} on:click={()=>toolStore.set("placement")}><CapAddIcon width={24}></CapAddIcon></button>
    <button class={$toolStore == "rotate" ? "active" : ""} on:click={()=>toolStore.set("rotate")}><i class="hi-rotate-right"></i></button>
</div>

<style>
	#toolbar-panel {
		top: 12px;
		left: 12px;
		z-index: 100;
		box-sizing: border-box;
	}
    button{
        background: none;
        outline: none;
        border: none;
        margin: 0;
        padding: 0;
        width: 30px;
        height: 30px;
    }
    button:active , button:hover, button.active{
        background: rgb(128, 200, 255);
    }
</style>
