<!-- svelte-ignore missing-declaration -->
<div class="logo-parent"><i class="hi-keyboard"></i>Unnamed Keyboard App<span class="secondary">{PKG.version}</span></div>

<style>
	.logo-parent {
		--hi-accent: red;
		display: flex;
		gap: 8px;
		align-items: center;
		box-sizing: border-box;
		padding: 8px;
		color: var(--main-text);
		--hi-accent: var(--main-text);
		--hi-base: var(--ui-bg);
		position: absolute;
		bottom: 12px;
		left: 12px;
        opacity: 0.5;
        pointer-events: none;
	}
    .secondary {
        opacity: 0.5;
    }
</style>
