<script>
	import { goto } from '$app/navigation';
	import Stepper from '$lib/components/Stepper.svelte';
	import LeaveSheet from '$lib/components/LeaveSheet.svelte';
	import IconMic from '@tabler/icons-svelte/icons/microphone';
	import IconStop from '@tabler/icons-svelte/icons/player-stop';
	import IconPlay from '@tabler/icons-svelte/icons/player-play';
	import IconCheck from '@tabler/icons-svelte/icons/circle-check';
	import { app, save, maskPhone } from '$lib/store.svelte.js';
	import { submitDraft } from '$lib/report/draft.js';
	let leave = $state(false);
	let sending = false;
	let rec = null, chunks = [], timer = null;
	let recording = $state(false), secs = $state(0), micError = $state('');
	$effect(() => { if (!app.draft && !sending) goto('/report'); });
	async function toggleRec() {
		if (recording) { rec.stop(); return; }
		try {
			const s = await navigator.mediaDevices.getUserMedia({ audio: true });
			rec = new MediaRecorder(s, { audioBitsPerSecond: 16000 }); chunks = []; secs = 0;
			rec.ondataavailable = (e) => chunks.push(e.data);
			rec.onstop = () => {
				clearInterval(timer); recording = false; s.getTracks().forEach((t) => t.stop());
				const r = new FileReader(); r.onload = () => { app.draft.voice = r.result; app.draft.voiceSecs = secs; save(); }; r.readAsDataURL(new Blob(chunks, { type: rec.mimeType }));
			};
			rec.start(); recording = true; timer = setInterval(() => { secs += 1; if (secs >= 60) rec.stop(); }, 1000);
		} catch { micError = 'The microphone is off. You can type instead.'; }
	}
	function send() { sending = true; const id = submitDraft(); goto(`/sent/${id}`, { replaceState: true }); }
</script>

{#if app.draft}
	<div class="stack gap-2xs">
		<h1 class="h2">Report a water problem</h1>
		<p class="body-s secondary">Your report goes to Makueni County Water. They check it before anything changes on the map.</p>
	</div>
	<Stepper current={3} />
	<div class="stack gap-lg">
		<h2 class="label">Tell us more</h2>
		<div class="card row gap-lg">
			<button class="mic" class:rec={recording} onclick={toggleRec} aria-label={recording ? 'Stop recording' : 'Record a voice note'}>
				{#if recording}<IconStop size={24} />{:else}<IconMic size={24} />{/if}
			</button>
			<div class="stack gap-2xs grow">
				<span class="label">{recording ? `Recording… 0:${String(secs).padStart(2, '0')}` : app.draft.voice ? `Voice note · 0:${String(app.draft.voiceSecs).padStart(2, '0')}` : 'Add a voice note'}</span>
				<span class="body-s secondary">{recording ? 'Tap to stop. Up to 1 minute.' : app.draft.voice ? 'Tap the microphone to record again.' : 'Optional. Speak in any language.'}</span>
			</div>
			{#if app.draft.voice && !recording}<button class="icon-btn" aria-label="Play voice note" onclick={() => new Audio(app.draft.voice).play()}><IconPlay size={24} /></button>{/if}
		</div>
		{#if micError}<p class="error-text">{micError}</p>{/if}
		<div class="field">
			<label class="label" for="note">What did you see? (optional)</label>
			<textarea id="note" class="input" placeholder="For example: water leaking since this morning" bind:value={app.draft.note} oninput={save}></textarea>
		</div>
		<div class="stack gap-xs">
			<span class="label">Phone number</span>
			<div class="row gap-sm"><IconCheck size={20} color="var(--status-operational-text)" /><span class="label grow">Verified · {maskPhone(app.phone)}</span><a class="label" style="color:var(--text-brand)" href="/account">Change</a></div>
			<p class="helper">Updates on this report go to this number. No code needed again on this phone.</p>
		</div>
	</div>
	<div class="grow"></div>
	<div class="stack gap-sm">
		<div class="btn-row"><button class="btn secondary" onclick={() => goto('/report/check')}>Back</button><button class="btn primary" onclick={send}>Send report</button></div>
		<p class="body-s secondary">Works offline. Photos are compressed to save data.</p>
	</div>
	<LeaveSheet bind:open={leave} onleave={() => { save(); goto('/home'); }} />
{/if}

<style>
	.mic { width: 48px; height: 48px; border-radius: 50%; border: 0; background: var(--action-primary); color: var(--text-on-brand); display: flex; align-items: center; justify-content: center; cursor: pointer; flex: none; }
	.mic.rec { background: var(--action-danger); animation: pulse 1.2s infinite; }
	@keyframes pulse { 50% { box-shadow: 0 0 0 8px color-mix(in srgb, var(--action-danger) 25%, transparent); } }
</style>
