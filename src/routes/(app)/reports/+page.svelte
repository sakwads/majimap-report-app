<script>
	import ReportItem from '$lib/components/ReportItem.svelte';
	import IconCamera from '@tabler/icons-svelte/icons/camera';
	import IconMessageReport from '@tabler/icons-svelte/icons/message-report';
	import { app } from '$lib/store.svelte.js';
</script>

<div class="stack gap-xs">
	<h1 class="h3">Reports</h1>
	<p class="body secondary">Report a problem or follow the reports you have sent.</p>
</div>
{#if app.reports.length}
	<div class="stack gap-sm">{#each app.reports as r (r.id)}<ReportItem report={r} />{/each}</div>
{:else}
	<div class="empty stack gap-sm">
		<span class="chip-icon"><IconMessageReport size={20} /></span>
		<span class="h4">No reports yet</span>
		<p class="body secondary">When you report a broken water point, a shortage or a leak, you can follow it here.</p>
	</div>
{/if}
<div class="pinned"><a class="btn primary" href="/report"><IconCamera size={20} />Report a problem</a></div>

<style>
	.empty { align-items: center; text-align: center; padding: var(--space-3xl) var(--space-lg); }
	.pinned { position: sticky; bottom: calc(var(--nav-h) + var(--space-lg) + env(safe-area-inset-bottom)); margin-top: auto; }
</style>
