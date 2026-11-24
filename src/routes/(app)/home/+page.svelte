<script>
	import Logo from '$lib/components/Logo.svelte';
	import PointItem from '$lib/components/PointItem.svelte';
	import ReportItem from '$lib/components/ReportItem.svelte';
	import IconCamera from '@tabler/icons-svelte/icons/camera';
	import { app, initials } from '$lib/store.svelte.js';
	import { WATER_POINTS, distanceM } from '$lib/data/static.js';
	import { here, locate } from '$lib/geo/location.svelte.js';
	$effect(() => { if (here.status === 'idle') locate(); });
	const nearest = $derived(WATER_POINTS.filter((p) => p.status === 'working').sort((a, b) => distanceM(here, a) - distanceM(here, b)).slice(0, 2));
</script>

<div class="row">
	<Logo size={32} />
	<span class="grow"></span>
	<a class="avatar" href="/account" aria-label="Account">{initials(app.name) || 'Me'}</a>
</div>
<div class="stack gap-xs">
	<h1 class="h3">Habari! Water near you</h1>
	<p class="body secondary">Report a broken water point, a shortage or a leak in three taps.</p>
</div>
<section class="promo stack gap-lg">
	<IconCamera size={24} />
	<div class="stack gap-xs"><span class="h4">Report a problem</span><span class="body">Take a photo. We’ll fill in the rest.</span></div>
	<a class="btn accent" href="/report">Take a photo</a>
</section>
<section class="stack gap-sm">
	<h2 class="label">Nearest working water points</h2>
	{#each nearest as p}<PointItem point={p} />{/each}
</section>
<section class="stack gap-sm">
	<h2 class="label">Your reports</h2>
	{#each app.reports.slice(0, 2) as r}<ReportItem report={r} />{/each}
</section>

<style>
	.avatar { width: 40px; height: 40px; border-radius: 50%; background: var(--surface-brand-subtle); color: var(--text-brand); display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 14px; }
	.promo { background: var(--surface-brand); color: var(--text-on-brand); border-radius: var(--radius-lg); padding: var(--space-xl) var(--space-lg); }
</style>
