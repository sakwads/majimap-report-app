<script>
	import Ripple from '$lib/components/Ripple.svelte';
	import { page } from '$app/stores';
	let { children } = $props();
	const camera = $derived($page.url.pathname === '/report');
</script>

{#if !camera}<Ripple />{/if}
<main class="full" class:camera>{@render children()}</main>

<style>
	.full { position: relative; z-index: 1; min-height: 100dvh; padding: var(--space-xl) var(--space-lg) calc(var(--space-lg) + env(safe-area-inset-bottom)); display: flex; flex-direction: column; gap: var(--space-xl); }
	.full.camera { padding: 0; }
</style>
