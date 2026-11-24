<script>
	import IconCheck from '@tabler/icons-svelte/icons/check';
	let { current = 1 } = $props();
	const steps = ['Photo', 'Check', 'Send'];
</script>

<ol class="steps" aria-label="Report steps">
	{#each steps as s, i}
		<li class:done={i < current - 1} class:cur={i === current - 1} aria-current={i === current - 1 ? 'step' : undefined}>
			<span class="dot">{#if i < current - 1}<IconCheck size={16} stroke={3} />{:else}{i + 1}{/if}</span>
			<span class="label-s">{s}</span>
		</li>
	{/each}
</ol>

<style>
	.steps { list-style: none; margin: 0; padding: 0; display: flex; }
	li { flex: 1 1 0; display: flex; flex-direction: column; align-items: center; gap: 6px; position: relative; color: var(--text-secondary); }
	li:not(:last-child)::after { content: ''; position: absolute; top: 15px; left: calc(50% + 18px); right: calc(-50% + 18px); height: 2px; background: var(--border-input); }
	li.done:not(:last-child)::after { background: var(--action-primary); }
	.dot { width: 32px; height: 32px; border-radius: 50%; border: 2px solid var(--border-input); display: flex; align-items: center; justify-content: center; font-family: var(--font-mono); font-size: 12px; background: var(--surface-raised); }
	.done .dot { background: var(--action-primary); border-color: var(--action-primary); color: var(--text-on-brand); }
	.cur { color: var(--text-brand); }
	.cur .dot { border-color: var(--border-brand); color: var(--text-brand); }
</style>
