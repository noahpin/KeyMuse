<script>
	import CapAddIcon from "./CapAddIcon.svelte";

</script>
<div id="toolbar-panel" class="ui-floating-element">
    <button><CapAddIcon width={24}></CapAddIcon></button>
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
    button:active , button:hover{
        background: rgb(128, 200, 255);
    }
</style>
