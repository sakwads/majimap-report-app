<script>
	import Header from '$lib/components/Header.svelte';
	import IconDevice from '@tabler/icons-svelte/icons/device-mobile';
	import IconSun from '@tabler/icons-svelte/icons/sun';
	import IconMoon from '@tabler/icons-svelte/icons/moon';
	import { app, save, applyTheme } from '$lib/store.svelte.js';
	const options = [
		{ id: 'system', label: 'Use phone setting', helper: 'Follows your phone’s light or dark setting.', Ic: IconDevice },
		{ id: 'light', label: 'Light', helper: 'Light background, dark text.', Ic: IconSun },
		{ id: 'dark', label: 'Dark', helper: 'Dark background, light text.', Ic: IconMoon }
	];
	function pick(id) { app.theme = id; save(); applyTheme(); }
</script>

<Header title="Appearance" back="/account" />
<p class="body-s secondary">Choose how MajiMap looks on this phone. Dark is easier on the eyes at night and saves battery on many phones.</p>
<div class="stack gap-sm" role="radiogroup" aria-label="Appearance">
	{#each options as o}
		<button class="opt" class:sel={app.theme === o.id} role="radio" aria-checked={app.theme === o.id} onclick={() => pick(o.id)}>
			<span class="chip-icon"><o.Ic size={20} /></span>
			<span class="stack gap-2xs grow"><span class="label">{o.label}</span><span class="body-s secondary">{o.helper}</span></span>
			<span class="radio" aria-hidden="true"></span>
		</button>
	{/each}
</div>

<style>
	.opt { display: flex; align-items: center; gap: var(--space-lg); padding: var(--space-lg); border-radius: var(--radius-md); border: 1px solid var(--border-input); background: var(--surface-raised); text-align: left; cursor: pointer; width: 100%; }
	.opt.sel { border: 2px solid var(--border-brand); background: var(--surface-brand-subtle); }
	.radio { width: 20px; height: 20px; border-radius: 50%; border: 2px solid var(--border-input); flex: none; }
	.sel .radio { border-color: var(--border-brand); background: radial-gradient(var(--action-primary) 45%, transparent 50%); }
</style>
