<script>
	import { goto } from '$app/navigation';
	import Logo from '$lib/components/Logo.svelte';
	import IconAlert from '@tabler/icons-svelte/icons/alert-circle';
	import { app, save } from '$lib/store.svelte.js';
	let phone = $state(app.phone || '');
	let error = $state('');
	function send(e) {
		e.preventDefault();
		const d = phone.replace(/\D/g, '');
		if (!/^0[17]\d{8}$/.test(d)) { error = 'Enter a Kenyan mobile number, for example 0712 345 456.'; return; }
		app.phone = d; save();
		goto('/sign-in/code');
	}
</script>

<Logo size={40} />
<div class="stack gap-2xs">
	<h1 class="h2">Sign in with your phone</h1>
	<p class="body-s secondary">Report water problems and follow them until they are fixed. No password: we text you a code.</p>
</div>
<form class="stack gap-xl grow" onsubmit={send}>
	<div class="field">
		<label class="label" for="phone">Phone number</label>
		<input id="phone" class="input" type="tel" inputmode="tel" autocomplete="tel" placeholder="07XX XXX XXX" bind:value={phone} aria-invalid={!!error} />
		{#if error}<p class="error-text" role="alert"><IconAlert size={16} />{error}</p>{:else}<p class="helper">Only the organisations that review your reports see your number.</p>{/if}
	</div>
	<div class="grow"></div>
	<div class="stack gap-sm">
		<a class="btn tertiary" href="/nearby">Find water nearby without signing in</a>
		<button class="btn primary" type="submit">Send code</button>
		<p class="body-s secondary">We never share your number with anyone else.</p>
	</div>
</form>
