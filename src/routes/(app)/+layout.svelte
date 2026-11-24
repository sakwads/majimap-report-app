<script>
	import BottomNav from '$lib/components/BottomNav.svelte';
	import Ripple from '$lib/components/Ripple.svelte';
	import { page } from '$app/stores';
	let { children } = $props();
	const isMap = $derived($page.url.pathname === '/nearby' && $page.url.searchParams.get('view') !== 'list');
</script>

{#if !isMap}<Ripple />{/if}
<main class="content" class:map={isMap}>{@render children()}</main>
<BottomNav />

<style>
	.content { position: relative; z-index: 1; padding: var(--space-xl) var(--space-lg) calc(var(--nav-h) + var(--space-xl) + env(safe-area-inset-bottom)); display: flex; flex-direction: column; gap: var(--space-xl); }
	.content.map { padding: 0; }
</style>
