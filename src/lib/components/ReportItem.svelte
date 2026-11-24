<script>
	import IconChevron from '@tabler/icons-svelte/icons/chevron-right';
	import IconMessageReport from '@tabler/icons-svelte/icons/message-report';
	import Badge from './Badge.svelte';
	import { REPORT_STATUS } from '$lib/data/static.js';
	import { app } from '$lib/store.svelte.js';
	let { report } = $props();
	const st = $derived(REPORT_STATUS[report.status]);
	const unread = $derived(report.message && !report.message.reply && !app.seenMessages.includes(report.id));
</script>

<a class="list-item" href="/reports/{report.id}">
	<span class="chip-icon accent"><IconMessageReport size={20} /></span>
	<span class="stack gap-xs grow">
		<span class="label">{report.title}</span>
		<span class="body-s secondary">{report.status === 'waiting' ? `Saved ${report.when}` : report.id} · {unread ? 'New message' : report.status === 'waiting' ? report.place.split(' · ')[1] || '' : report.when}</span>
		<Badge tone={st.tone} label={st.label} dot={st.dot} />
	</span>
	{#if unread}<span class="unread-dot" aria-hidden="true"></span>{/if}
	<IconChevron size={20} class="chev" />
</a>
