<script>
	import { page } from '$app/stores';
	import Header from '$lib/components/Header.svelte';
	import ReportCard from '$lib/components/ReportCard.svelte';
	import IconCheck from '@tabler/icons-svelte/icons/circle-check';
	import { app, save } from '$lib/store.svelte.js';
	const report = $derived(app.reports.find((r) => r.id === $page.params.id));
	let toast = $state('');
	$effect(() => { if (report?.message && !app.seenMessages.includes(report.id)) { app.seenMessages.push(report.id); save(); } });
	function reply(text) {
		const d = new Date();
		report.message.reply = { text, at: `${d.getDate()} ${d.toLocaleString('en-GB', { month: 'short' })}, ${d.toTimeString().slice(0, 5)}` };
		save();
		toast = `Reply sent to ${report.message.from}. Thank you.`;
		setTimeout(() => (toast = ''), 4000);
	}
</script>

<Header title="Report details" back="/reports" />
{#if report}<ReportCard {report} onreply={reply} />{:else}<p class="body">This report is not on this phone.</p>{/if}
{#if toast}<div class="toast" role="status"><IconCheck size={20} color="var(--status-operational-text)" /><span class="body">{toast}</span></div>{/if}
