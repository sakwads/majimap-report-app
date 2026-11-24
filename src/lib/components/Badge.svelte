<script>
	import IconCheck from '@tabler/icons-svelte/icons/check';
	import IconClock from '@tabler/icons-svelte/icons/clock';
	import IconInfo from '@tabler/icons-svelte/icons/info-circle';
	import IconAlert from '@tabler/icons-svelte/icons/alert-circle';
	let { tone = 'neutral', label, dot = false } = $props();
	const icon = { operational: IconCheck, unverified: IconClock, info: IconInfo, faulty: IconAlert, repair: IconAlert, warning: IconAlert };
	const Ic = $derived(icon[tone]);
</script>

<span class="badge {tone}">
	{#if dot || !Ic}<span class="dot"></span>{:else}<Ic size={12} stroke={2} />{/if}
	{label}
</span>
