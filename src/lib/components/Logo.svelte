<script lang="ts">
	import { RiLogosGithubFill } from "svelte-icons-pack/ri";
	import { Icon } from "svelte-icons-pack";
</script>

<div class="logo-parent">
	<div class="noclick">
		<span class="accent">
			<i class="hi-keyboard"></i>
			KeyMuse
		</span>
		<span class="secondary">
			<!-- svelte-ignore missing-declaration -->
			{PKG.version}
		</span>
	</div>
	<a href="https://discord.gg/wb9xS2d9eg" target="_blank">
		<Icon src={RiLogosGithubFill} color="black" size="24" />
	</a>
</div>

<style>
	.logo-parent {
		--hi-accent: red;
		box-sizing: border-box;
		display: flex;
		gap: 8px;
		align-items: center;
		padding: 8px;
		color: var(--main-text);
		--hi-accent: var(--main-text);
		--hi-base: var(--ui-bg);
		position: absolute;
		bottom: 12px;
		left: 12px;
	}
	.secondary {
		opacity: 0.5;
		display: flex;
		gap: 8px;
		align-items: center;
	}
	.noclick {
		pointer-events: none;
		display: flex;
		gap: 8px;
		align-items: center;
		opacity: 0.5;
	}
	a {
		display: flex;
		align-items: center;
		opacity: 0.25;
	}
	a:hover {
		opacity: 1;
	}
	.accent {
		display: flex;
		gap: 8px;
		align-items: center;
		color: var(--accent);
		--hi-accent: var(--accent);
		--hi-base: var(--ui-bg);
	}
</style>
