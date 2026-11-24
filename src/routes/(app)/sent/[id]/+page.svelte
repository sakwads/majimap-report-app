<script>
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import ReportCard from '$lib/components/ReportCard.svelte';
	import IconUpload from '@tabler/icons-svelte/icons/cloud-upload';
	import IconCheck from '@tabler/icons-svelte/icons/check';
	import IconAlert from '@tabler/icons-svelte/icons/alert-triangle';
	import IconX from '@tabler/icons-svelte/icons/alert-circle';
	import { app } from '$lib/store.svelte.js';
	import { markSent } from '$lib/report/draft.js';
	import { ORG } from '$lib/data/static.js';

	const report = $derived(app.reports.find((r) => r.id === $page.params.id));
	let state = $state('sending'); // sending | slow | failed | saved | sent
	let pct = $state(0);
	let timer;

	function run() {
		clearInterval(timer);
		if (!navigator.onLine) { state = 'saved'; return; }
		const net = navigator.connection?.effectiveType;
		const slow = net === 'slow-2g' || net === '2g' || $page.url.searchParams.get('net') === 'slow';
		state = slow ? 'slow' : 'sending'; pct = 0;
		const step = slow ? 2 : 7;
		timer = setInterval(() => {
			if (!navigator.onLine) { clearInterval(timer); state = 'failed'; return; }
			pct = Math.min(100, pct + step);
			if (pct >= 100) { clearInterval(timer); markSent(report); state = 'sent'; }
		}, 250);
	}
	$effect(() => { if (report) run(); const off = () => { if (state === 'sending' || state === 'slow') { clearInterval(timer); state = 'failed'; } }; addEventListener('offline', off); return () => { clearInterval(timer); removeEventListener('offline', off); }; });

	const head = $derived({
		sending: [IconUpload, 'Sending your report', 'The words go first, then the photos (shrunk to about 300 KB). You can leave the app; it carries on.'],
		slow: [IconUpload, 'Still sending', `${ORG} already has your words and location. The photos will follow.`],
		failed: [IconX, 'Could not send', 'The connection dropped. Your report is saved on this phone and nothing is lost.'],
		saved: [IconUpload, 'Saved on your phone', 'No connection right now. Your report will send itself when you’re back online.'],
		sent: [IconCheck, 'Report sent', `${ORG} will check it. It shows as Unverified on the map until they do.`]
	}[state]);
	const HeadIcon = $derived(head[0]);
	const photosSent = $derived(report ? Math.min(report.photos, Math.floor((pct / 100) * (report.photos + 1))) : 0);
</script>

{#if report}
	<div class="stack gap-sm">
		<span class="chip" class:ok={state === 'sent'} class:bad={state === 'failed'}><HeadIcon size={24} /></span>
		<h1 class="h3">{head[1]}</h1>
		<p class="body secondary">{head[2]}</p>
	</div>
	{#if state === 'sending' || state === 'slow'}
		<div class="stack gap-sm">
			<div class="row"><span class="label-s grow">Sending photos</span><span class="label-s">{pct}%</span></div>
			<div class="progress" class:warning={state === 'slow'}><span style="width:{pct}%"></span></div>
			<p class="body-s secondary">Photo {photosSent} of {report.photos} sent{state === 'slow' ? ' · weak signal, sending slowly to save your data' : ''}.</p>
		</div>
		{#if state === 'slow'}<div class="alert warning"><IconAlert size={20} class="ic" /><p class="body-s">Weak signal. Sending slowly to save your data.</p></div>{/if}
	{:else if state === 'failed'}
		<div class="alert error"><IconX size={20} class="ic" /><p class="body-s">Sending failed. Try again now or let it send itself later.</p></div>
	{/if}
	<ReportCard {report} />
	<div class="pinned">
		{#if state === 'failed'}
			<div class="btn-row"><button class="btn secondary" onclick={() => goto('/reports')}>Send later</button><button class="btn primary" onclick={run}>Try again</button></div>
		{:else if state === 'sent' || state === 'saved'}
			<button class="btn primary" onclick={() => goto('/reports')}>Done</button>
		{:else}
			<button class="btn secondary" onclick={() => goto('/reports')}>Continue in the background</button>
		{/if}
	</div>
{/if}

<style>
	.chip { width: 48px; height: 48px; border-radius: 50%; background: var(--surface-low); display: flex; align-items: center; justify-content: center; }
	.chip.ok { background: var(--status-operational-bg); color: var(--status-operational-text); }
	.chip.bad { background: var(--status-faulty-bg); color: var(--status-faulty-text); }
	.pinned { position: sticky; bottom: calc(var(--nav-h) + var(--space-lg) + env(safe-area-inset-bottom)); }
</style>
