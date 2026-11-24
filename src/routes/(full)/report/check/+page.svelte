<script>
	import { goto } from '$app/navigation';
	import Stepper from '$lib/components/Stepper.svelte';
	import TypeIcon from '$lib/components/TypeIcon.svelte';
	import LeaveSheet from '$lib/components/LeaveSheet.svelte';
	import IconSparkles from '@tabler/icons-svelte/icons/sparkles';
	import IconMapPin from '@tabler/icons-svelte/icons/map-pin';
	import { app, save } from '$lib/store.svelte.js';
	import { REPORT_TYPES, WATER_POINTS, distanceM, fmtDistance } from '$lib/data/static.js';
	let leave = $state(false);
	$effect(() => { if (!app.draft) return; else if (!app.draft.type) { app.draft.type = app.draft.aiType; save(); } });
	const point = $derived(WATER_POINTS.find((p) => p.id === app.draft?.point));
	function next() {
		const dup = app.reports.find((r) => r.point === app.draft.point && r.type === app.draft.type && ['unverified', 'review', 'waiting'].includes(r.status));
		goto(dup ? `/report/already?id=${dup.id}` : '/report/send');
	}
</script>

{#if app.draft}
	<div class="stack gap-2xs">
		<h1 class="h2">Report a water problem</h1>
		<p class="body-s secondary">Your report goes to Makueni County Water. They check it before anything changes on the map.</p>
	</div>
	<Stepper current={2} />
	<div class="stack gap-sm">
		<h2 class="label">Is this right?</h2>
		<div class="alert info"><IconSparkles size={20} class="ic" /><p class="body-s">From your photo we think this is a <b>leak or damaged pipe</b> (fairly sure). Change it if it’s wrong.</p></div>
		<div class="stack gap-sm" role="radiogroup" aria-label="Problem type">
			{#each REPORT_TYPES as t}
				<button class="opt" class:sel={app.draft.type === t.id} role="radio" aria-checked={app.draft.type === t.id} onclick={() => { app.draft.type = t.id; save(); }}>
					<span class="chip-icon"><TypeIcon type={t.id} /></span>
					<span class="stack gap-2xs grow"><span class="label">{t.label}</span><span class="body-s secondary">{t.helper}</span></span>
					<span class="radio" aria-hidden="true"></span>
				</button>
			{/each}
		</div>
		{#if point}
			<p class="row gap-xs body-s secondary"><IconMapPin size={16} />Near {point.name}{app.draft.lat ? ` (${fmtDistance(distanceM({ lat: app.draft.lat, lng: app.draft.lng }, point))})` : ''}</p>
		{/if}
	</div>
	<div class="grow"></div>
	<div class="btn-row">
		<button class="btn secondary" onclick={() => (leave = true)}>Back</button>
		<button class="btn primary" onclick={next}>Next</button>
	</div>
	<LeaveSheet bind:open={leave} onleave={() => { save(); goto('/home'); }} />
{/if}

<style>
	.opt { display: flex; align-items: center; gap: var(--space-lg); padding: var(--space-lg); border-radius: var(--radius-md); border: 1px solid var(--border-input); background: var(--surface-raised); text-align: left; cursor: pointer; width: 100%; }
	.opt.sel { border: 2px solid var(--border-brand); background: var(--surface-brand-subtle); }
	.radio { width: 20px; height: 20px; border-radius: 50%; border: 2px solid var(--border-input); flex: none; }
	.sel .radio { border-color: var(--border-brand); background: radial-gradient(var(--action-primary) 45%, transparent 50%); }
</style>
