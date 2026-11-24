<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Badge from '$lib/components/Badge.svelte';
	import IconInfo from '@tabler/icons-svelte/icons/info-circle';
	import { app, save } from '$lib/store.svelte.js';
	import { REPORT_STATUS } from '$lib/data/static.js';
	const existing = $derived(app.reports.find((r) => r.id === $page.url.searchParams.get('id')));
	function addPhoto() {
		existing.photos += app.draft.photos.length;
		existing.photoUrls = [...(existing.photoUrls || []), ...app.draft.photos];
		app.draft = null; save(); goto(`/reports/${existing.id}`);
	}
</script>

{#if existing}
	<div class="stack gap-2xs">
		<h1 class="h2">Already reported</h1>
		<p class="body-s secondary">Someone reported the same problem here {existing.when.toLowerCase().startsWith('today') ? 'today' : 'recently'}. Adding your photo helps the county more than a new report.</p>
	</div>
	<div class="card stack gap-sm">
		<span class="label">{existing.title}</span>
		<span class="mono-s secondary">{existing.id}</span>
		<span class="body-s secondary">{existing.place} · {existing.when}</span>
		<Badge tone={REPORT_STATUS[existing.status].tone} label={REPORT_STATUS[existing.status].label} dot={REPORT_STATUS[existing.status].dot} />
	</div>
	<div class="alert info"><IconInfo size={20} class="ic" /><p class="body-s">One report per problem keeps the queue short so it gets fixed sooner.</p></div>
	<div class="grow"></div>
	<div class="stack gap-sm">
		<button class="btn primary" onclick={addPhoto}>Add my photo to that report</button>
		<button class="btn secondary" onclick={() => goto('/report/send')}>This is a different problem</button>
	</div>
{/if}
