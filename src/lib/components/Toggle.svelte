<script>
	import IconCheck from '@tabler/icons-svelte/icons/check';
	let { checked = $bindable(false), label, helper = '', onchange = null } = $props();
	const id = 't' + Math.random().toString(36).slice(2, 8);
</script>

<div class="card row gap-lg">
	<label class="grow stack gap-2xs" for={id}>
		<span class="label">{label}</span>
		{#if helper}<span class="helper">{helper}</span>{/if}
	</label>
	<span class="toggle">
		<input {id} type="checkbox" role="switch" bind:checked onchange={() => onchange?.(checked)} />
		<span class="track"><span class="thumb">{#if checked}<IconCheck size={14} stroke={3} />{/if}</span></span>
	</span>
</div>
