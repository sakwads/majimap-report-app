<script>
	import { page } from '$app/stores';
	import WaterMap from '$lib/components/WaterMap.svelte';
	import PointItem from '$lib/components/PointItem.svelte';
	import IconList from '@tabler/icons-svelte/icons/list';
	import IconMap from '@tabler/icons-svelte/icons/map';
	import { WATER_POINTS, distanceM } from '$lib/data/static.js';
	import { here, locate } from '$lib/geo/location.svelte.js';
	$effect(() => { if (here.status === 'idle') locate(); });
	const list = $derived($page.url.searchParams.get('view') === 'list');
	let workingOnly = $state(true);
	const points = $derived(WATER_POINTS.filter((p) => !workingOnly || p.status === 'working').sort((a, b) => distanceM(here, a) - distanceM(here, b)));
</script>

{#if list}
	<div class="stack gap-xs">
		<h1 class="h3">Nearby water</h1>
		<p class="body secondary">Working water points near you, nearest first. A report only changes a status after the county checks it.</p>
	</div>
	<div class="row gap-sm">
		<button class="chipf" class:on={workingOnly} onclick={() => (workingOnly = true)}>Working only</button>
		<button class="chipf" class:on={!workingOnly} onclick={() => (workingOnly = false)}>All water points</button>
		<span class="grow"></span>
		<a class="chipf" href="/nearby"><IconMap size={16} />Map</a>
	</div>
	<div class="stack gap-sm">{#each points as p (p.id)}<PointItem point={p} />{/each}</div>
{:else}
	<WaterMap />
	<a class="float btn secondary small" href="/nearby?view=list"><IconList size={18} />List</a>
	<div class="legend card body-s"><span><i style="background:#1e7a4c"></i>Working</span><span><i style="background:#a04a00"></i>Needs repair</span><span><i style="background:#b3261e"></i>Not working</span></div>
{/if}

<style>
	.chipf { display: inline-flex; gap: 4px; align-items: center; min-height: 36px; padding: 0 12px; border-radius: var(--radius-pill); border: 1px solid var(--border-input); background: var(--surface-raised); font-size: 12px; font-weight: 500; cursor: pointer; color: var(--text-default); }
	.chipf.on { background: var(--surface-brand-subtle); border-color: var(--border-brand); color: var(--text-brand); }
	.float { position: fixed; top: calc(16px + env(safe-area-inset-top)); left: 16px; width: auto; z-index: 5; box-shadow: 0 4px 12px rgb(0 0 0 / 0.15); }
	.legend { position: fixed; left: 16px; bottom: calc(var(--nav-h) + 16px + env(safe-area-inset-bottom)); z-index: 5; display: flex; gap: 12px; padding: 8px 12px; }
	.legend i { display: inline-block; width: 10px; height: 10px; border-radius: 50%; margin-right: 4px; }
</style>
