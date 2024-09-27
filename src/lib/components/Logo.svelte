<script lang="ts">
	import {IconBrandGithubFilled} from "@tabler/icons-svelte";

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
	<a href="https://github.com/noahpin/KeyMuse" target="_blank">
		<IconBrandGithubFilled color="black"></IconBrandGithubFilled>
	</a>
</div>

<style>
	.logo-parent {
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
		user-select: none;
	}
	.secondary {
		opacity: 0.5;
		display: flex;
		gap: 8px;
		align-items: center;
	}
	.noclick {
		pointer-events: none !important;
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
