<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Logo from '$lib/components/Logo.svelte';
	import CodeInput from '$lib/components/CodeInput.svelte';
	import { app, prettyPhone } from '$lib/store.svelte.js';
	let { reset = false } = $props();
	let code = $state('');
	let error = $state('');
	let left = $state(45);
	$effect(() => { const t = setInterval(() => (left = Math.max(0, left - 1)), 1000); return () => clearInterval(t); });
	const isReset = $derived(reset || $page.url.pathname.startsWith('/unlock'));
	function verify() {
		if (code.length < 6) { error = 'Enter all 6 digits.'; return; }
		if (code === '000000') { error = 'That code is not right. Check the SMS and try again.'; return; }
		goto(isReset ? '/unlock/new-pin' : '/sign-in/pin');
	}
</script>

<Logo size={40} />
<div class="stack gap-2xs">
	<h1 class="h2">{isReset ? 'Reset your PIN' : 'Enter the code'}</h1>
	<p class="body-s secondary">We sent a 6-digit code to {prettyPhone(app.phone)}{isReset ? ' to check it is you' : ''}. On most phones it fills in by itself.</p>
</div>
<div class="stack gap-sm">
	<CodeInput length={6} bind:value={code} error={error} oncomplete={() => (error = '')} label="6-digit code" />
	{#if left > 0}<p class="body-s secondary">Didn’t get it? You can ask for a new code in 0:{String(left).padStart(2, '0')}.</p>
	{:else}<button class="btn tertiary small" style="width:fit-content;padding:0" onclick={() => { left = 45; error = ''; code = ''; }}>Send a new code</button>{/if}
	<p class="body-s tertiary">Prototype: any 6 digits work, except 000000 (shows the wrong-code state).</p>
</div>
<div class="grow"></div>
<div class="stack gap-sm">
	<div class="btn-row">
		<button class="btn secondary" onclick={() => goto(isReset ? '/unlock' : '/sign-in')}>{isReset ? 'Cancel' : 'Change number'}</button>
		<button class="btn primary" onclick={verify}>Verify</button>
	</div>
	<p class="body-s secondary">The code works for 10 minutes.</p>
</div>
