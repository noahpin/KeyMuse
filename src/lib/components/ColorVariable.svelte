<script lang="ts">
	import { deleteVariable, updateVariableData } from "$lib";

	export let variable: ColorVariable;

	let color = variable.color;
	let id = variable.id;
	let name = variable.displayName;
</script>

<div class="color-input">
	<div class="color-side">
		<input
			name="textColor"
			type="color"
			bind:value={color}
			on:input={() => {
				updateVariableData(id, null, color);
			}}
		/>
		<div class="preview" style={`background: ${color}`}></div>
	</div>
    <div class="name-side">
        <input type="text" bind:value={name}
        on:input={() => {
            updateVariableData(id, name, null);
        }}
        >
    </div>
    <button on:click={e => deleteVariable(id)}><i class="hi-x"></i></button>
</div>

<style>
	input {
		width: 100%;
	}
    .name-side {
        min-width: 50%;
        height: 30px;
    }
    .name-side input {
        height: 30px;
        border-radius: 0;
		box-sizing: border-box;
		outline: none;
		border: none;
        padding: 8px;
		border-left: 1px solid var(--ui-transparent-outline);
    }
    
	button {
		width: 30px;
		flex-basis: 30px;
		height: 30px;
		flex-shrink: 0;
		border: none;
		background: none;
		padding: 0 !important;
		border-radius: 0;
		border-left: 1px solid var(--ui-transparent-outline);
		display: flex;
		justify-content: center;
		align-items: center;
		color: var(--secondary-text);
        cursor: pointer;
	}
</style>
