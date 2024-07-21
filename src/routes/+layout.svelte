<script>
    import {page} from '$app/stores';
</script>
<svelte:head>
    <meta property="og:image" content={`${$page.url.href}og-image.png`} />
</svelte:head>
<slot></slot>
