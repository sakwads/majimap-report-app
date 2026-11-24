<script>
	import { goto } from '$app/navigation';
	import Logo from '$lib/components/Logo.svelte';
	import IconFingerprint from '@tabler/icons-svelte/icons/fingerprint';
	import { app, save, setUnlocked } from '$lib/store.svelte.js';
	import { registerBiometric } from '$lib/auth/biometric.js';
	let error = $state('');
	function done() { setUnlocked(true); goto('/home'); }
	async function turnOn() {
		try { app.credentialId = await registerBiometric(app.phone); app.biometric = true; save(); done(); }
		catch { error = 'Fingerprint was not set up. You can try again later in Account.'; }
	}
</script>

<Logo size={40} />
<div class="stack gap-2xs">
	<h1 class="h2">Unlock with your fingerprint?</h1>
	<p class="body-s secondary">Faster than typing your PIN. Your fingerprint stays on your phone; MajiMap never sees it.</p>
</div>
<span class="chip"><IconFingerprint size={48} /></span>
{#if error}<p class="error-text">{error}</p>{/if}
<div class="grow"></div>
<div class="stack gap-sm">
	<div class="btn-row"><button class="btn secondary" onclick={done}>Not now</button><button class="btn primary" onclick={turnOn}>Turn on</button></div>
	<p class="body-s secondary">You can turn it off any time in Account.</p>
</div>

<style>
	.chip { width: 96px; height: 96px; border-radius: 50%; background: var(--surface-brand-subtle); color: var(--text-brand); display: flex; align-items: center; justify-content: center; }
</style>
