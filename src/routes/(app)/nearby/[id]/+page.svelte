<script>
	import { page } from '$app/stores';
	import Header from '$lib/components/Header.svelte';
	import Badge from '$lib/components/Badge.svelte';
	import IconInfo from '@tabler/icons-svelte/icons/info-circle';
	import { WATER_POINTS, STATUS, distanceM, fmtDistance } from '$lib/data/static.js';
	import { here } from '$lib/geo/location.svelte.js';
	import { app } from '$lib/store.svelte.js';
	const p = $derived(WATER_POINTS.find((x) => x.id === $page.params.id));
</script>

{#if p}
	<Header title={p.name} back="/nearby?view=list" />
	<div class="stack gap-sm">
		<span class="mono-s secondary">{p.id}</span>
		<Badge tone={STATUS[p.status].tone} label={STATUS[p.status].label} />
	</div>
	<dl class="facts">
		<dt>Distance</dt><dd>{fmtDistance(distanceM(here, p))} from you</dd>
		<dt>Last checked</dt><dd>{p.checked} by {p.checkedBy}</dd>
		<dt>Type</dt><dd>{p.type}</dd>
		<dt>Open</dt><dd>{p.open}</dd>
	</dl>
	{#if p.note}<div class="alert info"><IconInfo size={20} class="ic" /><p class="body-s">{p.note}</p></div>{/if}
	<div class="stack gap-sm">
		<a class="btn primary" target="_blank" rel="noopener" href="https://www.google.com/maps/dir/?api=1&destination={p.lat},{p.lng}">Get directions</a>
		<a class="btn secondary" href={app.signedIn ? `/report?point=${p.id}` : '/sign-in'}>Report a problem here</a>
	</div>
{/if}

<style>
	/* Fact Item Inline: 96 px label column, value 8 px after, both left-aligned; values wrap under themselves. */
	.facts { display: grid; grid-template-columns: 96px 1fr; gap: var(--space-lg) var(--space-sm); margin: 0; align-items: baseline; }
	dt { font-family: var(--font-mono); font-size: 12px; line-height: 16px; font-weight: 500; color: var(--text-secondary); }
	dd { margin: 0; font-size: 14px; line-height: 20px; }
</style>
