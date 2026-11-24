<script>
	import IconDroplet from '@tabler/icons-svelte/icons/droplet';
	import IconChevron from '@tabler/icons-svelte/icons/chevron-right';
	import Badge from './Badge.svelte';
	import { STATUS, distanceM, fmtDistance } from '$lib/data/static.js';
	import { here } from '$lib/geo/location.svelte.js';
	let { point } = $props();
	const st = $derived(STATUS[point.status]);
</script>

<a class="list-item" href="/nearby/{point.id}">
	<span class="chip-icon accent"><IconDroplet size={20} /></span>
	<span class="stack gap-xs grow">
		<span class="label">{point.name}</span>
		<span class="body-s secondary">{point.ward} · checked {point.checked}</span>
		<Badge tone={st.tone} label={st.label} />
	</span>
	<span class="label" style="white-space:nowrap">{fmtDistance(distanceM(here, point))}</span>
	<IconChevron size={20} class="chev" />
</a>
