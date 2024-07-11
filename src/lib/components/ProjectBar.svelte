<script>
	import CapAddIcon from "./CapAddIcon.svelte";
    import { toolStore } from "$lib";
    import { projectFile } from "$lib";

</script>
<div id="toolbar-panel" class="ui-floating-element" >
    <button disabled on:click={()=>toolStore.set("rotate")}><i class="hi-carat-left"></i></button>
    <div class="divider"></div>
    <button disabled on:click={()=>toolStore.set("rotate")}><i class="hi-gear"></i></button>
    <button disabled on:click={()=>toolStore.set("rotate")}><i class="hi-import"></i></button>
    <button disabled on:click={()=>toolStore.set("rotate")}><i class="hi-export"></i></button>
    <div class="divider"></div>
    <div class="project-details"><i class="hi-keyboard"></i>{$projectFile.name}</div>
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
        width: 1px; height: 34px; background: var(--ui-light-gray)
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
    button:active {
        background: var(--accent);
        color: white;
    }
</style>
