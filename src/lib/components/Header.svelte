<script>
	import IconArrowLeft from '@tabler/icons-svelte/icons/arrow-left';
	let { title, back = null, onback = null } = $props();
	function go() { if (onback) onback(); else if (back) location.href = back; else history.back(); }
</script>

<div class="hd">
	<button class="icon-btn back" aria-label="Back" onclick={go}><IconArrowLeft size={24} /></button>
	<h1 class="h3">{title}</h1>
</div>

<style>
	.hd { position: relative; display: flex; align-items: center; min-height: 48px; padding-left: 40px; }
	.back { position: absolute; left: -12px; top: 0; color: var(--text-brand); }
</style>
