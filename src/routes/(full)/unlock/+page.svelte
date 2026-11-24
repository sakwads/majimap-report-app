<script>
	import { goto } from '$app/navigation';
	import Logo from '$lib/components/Logo.svelte';
	import CodeInput from '$lib/components/CodeInput.svelte';
	import IconFingerprint from '@tabler/icons-svelte/icons/fingerprint';
	import { app, hashPin, setUnlocked, maskPhone } from '$lib/store.svelte.js';
	import { verifyBiometric } from '$lib/auth/biometric.js';
	let pin = $state('');
	let error = $state('');
	let tries = $state(3);
	async function check(v) {
		if ((await hashPin(v)) === app.pinHash) { setUnlocked(true); goto('/home'); return; }
		tries -= 1; pin = '';
		if (tries <= 0) { goto('/unlock/forgot'); return; }
		error = `Wrong PIN. ${tries} ${tries === 1 ? 'try' : 'tries'} left before we text you a code.`;
	}
	async function bio() {
		try { await verifyBiometric(app.credentialId); setUnlocked(true); goto('/home'); } catch { /* cancelled: PIN stays */ }
	}
	$effect(() => { if (app.biometric && app.credentialId) bio(); });
</script>

<Logo size={40} />
<div class="stack gap-2xs">
	<h1 class="h2">Welcome back</h1>
	<p class="body-s secondary">Enter your PIN to open MajiMap.</p>
</div>
<CodeInput length={4} masked bind:value={pin} error={error} oncomplete={check} label="Your 4-digit PIN" />
<div class="grow"></div>
<div class="stack gap-sm">
	<a class="btn tertiary" href="/unlock/forgot">Forgot PIN?</a>
	{#if app.biometric}<button class="btn secondary" onclick={bio}><IconFingerprint size={20} />Use fingerprint</button>{/if}
	<p class="body-s secondary">Signed in as {maskPhone(app.phone)}.</p>
</div>
