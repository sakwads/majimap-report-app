<script>
	import { goto } from '$app/navigation';
	import Header from '$lib/components/Header.svelte';
	import Toggle from '$lib/components/Toggle.svelte';
	import IconUser from '@tabler/icons-svelte/icons/user';
	import IconLock from '@tabler/icons-svelte/icons/lock';
	import IconSun from '@tabler/icons-svelte/icons/sun';
	import IconLanguage from '@tabler/icons-svelte/icons/language';
	import IconChevron from '@tabler/icons-svelte/icons/chevron-right';
	import { app, save, signOut, deleteAccount, prettyPhone } from '$lib/store.svelte.js';
	import { registerBiometric, biometricAvailable } from '$lib/auth/biometric.js';
	let confirm = $state(false);
	let editing = $state(false);
	let nameDraft = $state(app.name);
	let bio = $state(app.biometric);
	let canBio = $state(false);
	$effect(() => { biometricAvailable().then((v) => (canBio = v)); });
	const themeLabel = { system: 'Use phone setting', light: 'Light', dark: 'Dark' };
	async function onBio(on) {
		if (on) { try { app.credentialId = await registerBiometric(app.phone); app.biometric = true; } catch { bio = false; app.biometric = false; } }
		else { app.biometric = false; app.credentialId = ''; }
		save();
	}
</script>

<Header title="Account" back="/home" />
<section class="stack gap-sm">
	<h2 class="label-s secondary">You</h2>
	{#if editing}
		<form class="card stack gap-sm" onsubmit={(e) => { e.preventDefault(); app.name = nameDraft.trim(); save(); editing = false; }}>
			<label class="label" for="nm">Your name (optional)</label>
			<input id="nm" class="input" bind:value={nameDraft} placeholder="For example Mwende Kioko" />
			<p class="helper">Reviewers see this with your reports.</p>
			<div class="btn-row"><button type="button" class="btn secondary small" onclick={() => (editing = false)}>Cancel</button><button class="btn primary small">Save</button></div>
		</form>
	{:else}
		<button class="list-item" onclick={() => (editing = true)}><span class="chip-icon"><IconUser size={20} /></span><span class="stack gap-2xs grow"><span class="label">{app.name || 'Add your name'}</span><span class="body-s secondary">{prettyPhone(app.phone)}</span></span><IconChevron size={20} /></button>
	{/if}
</section>
<section class="stack gap-sm">
	<h2 class="label-s secondary">Unlock</h2>
	{#if canBio}<Toggle bind:checked={bio} label="Unlock with fingerprint" helper="Use your fingerprint instead of your PIN on this phone." onchange={onBio} />{/if}
	<a class="list-item" href="/unlock/forgot"><span class="chip-icon"><IconLock size={20} /></span><span class="stack gap-2xs grow"><span class="label">Change PIN</span><span class="body-s secondary">Your 4-digit PIN for this phone</span></span><IconChevron size={20} /></a>
</section>
<section class="stack gap-sm">
	<h2 class="label-s secondary">Updates</h2>
	<Toggle bind:checked={app.sms} label="SMS updates" helper="A text when a report you sent changes or a reviewer writes." onchange={save} />
</section>
<section class="stack gap-sm">
	<h2 class="label-s secondary">Display</h2>
	<a class="list-item" href="/account/appearance"><span class="chip-icon"><IconSun size={20} /></span><span class="stack gap-2xs grow"><span class="label">Appearance</span><span class="body-s secondary">{themeLabel[app.theme]}</span></span><IconChevron size={20} /></a>
	<div class="list-item" aria-disabled="true"><span class="chip-icon"><IconLanguage size={20} /></span><span class="stack gap-2xs grow"><span class="label">Language</span><span class="body-s secondary">English (Kiswahili and Kikamba coming)</span></span></div>
</section>
<div class="stack gap-sm">
	<button class="btn secondary" onclick={() => { signOut(); goto('/sign-in'); }}>Sign out</button>
	<button class="btn danger" onclick={() => (confirm = true)}>Delete my account and data</button>
</div>

{#if confirm}
	<div class="scrim" onclick={() => (confirm = false)} role="presentation"></div>
	<div class="sheet" role="dialog" aria-modal="true" aria-labelledby="dtitle">
		<h2 id="dtitle" class="h4">Delete your account?</h2>
		<p class="body secondary">This removes your name, phone number, PIN and messages from MajiMap. Your reports stay on the map without your details. This cannot be undone.</p>
		<button class="btn danger" onclick={() => { deleteAccount(); goto('/sign-in'); }}>Delete my account</button>
		<button class="btn secondary" onclick={() => (confirm = false)}>Keep my account</button>
	</div>
{/if}
