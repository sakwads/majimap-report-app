<script>
	import Badge from './Badge.svelte';
	import TypeIcon from './TypeIcon.svelte';
	import IconCircleCheck from '@tabler/icons-svelte/icons/circle-check';
	import IconClock from '@tabler/icons-svelte/icons/clock';
	import IconMinus from '@tabler/icons-svelte/icons/minus';
	import IconMessage from '@tabler/icons-svelte/icons/message-circle';
	import IconPhoto from '@tabler/icons-svelte/icons/photo';
	import IconMapPin from '@tabler/icons-svelte/icons/map-pin';
	import { REPORT_STATUS } from '$lib/data/static.js';
	let { report, onreply = null } = $props();
	const st = $derived(REPORT_STATUS[report.status]);
	const lastDone = $derived(report.steps.reduce((acc, s, i) => (s[1] ? i : acc), -1));
</script>

<article class="card stack gap-lg">
	<div class="row gap-lg">
		<span class="chip-icon" style="background:var(--status-unverified-bg);color:var(--status-unverified-text)"><TypeIcon type={report.type} /></span>
		<div class="stack gap-xs grow">
			<span class="label">{report.title}</span>
			<span class="mono-s secondary">{report.id}</span>
			<Badge tone={st.tone} label={st.label} dot={st.dot} />
		</div>
	</div>
	<div class="stack gap-xs">
		<span class="body-s secondary">{report.place}</span>
		<span class="body-s secondary">{report.when}{report.accuracy ? ` · location accurate to ${report.accuracy} m` : ''}</span>
		{#if report.note}<p class="body">{report.note}</p>{/if}
	</div>
	{#if report.photos}
		<div class="photos">
			{#each report.photoUrls?.length ? report.photoUrls : Array(report.photos).fill(null) as url}
				<div class="photo">{#if url}<img src={url} alt="Taken with this report" />{:else}<IconPhoto size={20} />{/if}<span class="pin"><IconMapPin size={14} /></span></div>
			{/each}
		</div>
	{/if}
	<div class="stack gap-sm">
		<span class="label-s tertiary">Progress</span>
		{#each report.steps as [label, date], i}
			<div class="row gap-sm">
				{#if date}<IconCircleCheck size={20} color="var(--status-operational-text)" />{:else if i === lastDone + 1 && report.status !== 'waiting'}<IconClock size={20} />{:else}<IconMinus size={20} color="var(--text-tertiary)" />{/if}
				<span class="grow" class:label={!!date || i === lastDone + 1} class:secondary={!date && i !== lastDone + 1}>{label}</span>
				<span class="label-s tertiary">{date || (report.status === 'waiting' && i === 0 ? 'When online' : 'Not yet')}</span>
			</div>
			{#if report.message && i === 1}
				<div class="msg stack gap-sm">
					<div class="row gap-sm"><IconMessage size={20} /><span class="label grow">{report.message.from}</span><span class="label-s secondary">{report.message.at}</span></div>
					{#if report.message.type === 'question'}
						{#if report.message.reply}<Badge tone="operational" label="Replied" />{:else}<Badge tone="warning" label="Reply needed" />{/if}
					{/if}
					<p class="body">{report.message.text}</p>
					{#if report.message.type === 'question' && !report.message.reply}
						<div class="stack gap-sm">
							<button class="btn primary small" onclick={() => onreply?.(report.message.answers[0])}>{report.message.answers[0]}</button>
							<button class="btn secondary small" onclick={() => onreply?.(report.message.answers[1])}>{report.message.answers[1]}</button>
						</div>
					{:else if report.message.reply}
						<div class="row gap-sm body-s"><IconCircleCheck size={20} />You replied: {report.message.reply.text} · {report.message.reply.at}</div>
					{/if}
				</div>
			{/if}
		{/each}
		<p class="body-s secondary">{report.status === 'waiting' ? 'Not sent yet. Saved on this phone.' : 'We’ll text you when this changes. Only the reviewing organisation sees your number.'}</p>
	</div>
</article>

<style>
	.photos { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-sm); }
	.photo { position: relative; aspect-ratio: 4/3; border-radius: var(--radius-sm); background: var(--surface-brand-subtle); color: var(--text-brand); display: flex; align-items: center; justify-content: center; overflow: hidden; }
	.photo img { width: 100%; height: 100%; object-fit: cover; }
	.pin { position: absolute; left: 6px; bottom: 6px; width: 24px; height: 24px; border-radius: 50%; background: var(--surface-raised); display: flex; align-items: center; justify-content: center; color: var(--text-default); }
	.msg { background: var(--status-info-bg); border-radius: var(--radius-lg); padding: var(--space-lg); }
</style>
