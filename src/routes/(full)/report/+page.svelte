<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import IconX from '@tabler/icons-svelte/icons/x';
	import IconMapPin from '@tabler/icons-svelte/icons/map-pin';
	import IconPhoto from '@tabler/icons-svelte/icons/photo';
	import IconCameraOff from '@tabler/icons-svelte/icons/camera-off';
	import { app, save } from '$lib/store.svelte.js';
	import { newDraft, compress, fileToDataUrl, nearestPoint } from '$lib/report/draft.js';
	import { here, locate } from '$lib/geo/location.svelte.js';

	let video = $state();
	let stream = null;
	let camState = $state('starting'); // starting | live | denied | review
	let fileInput;

	$effect(() => {
		if (!app.draft) newDraft($page.url.searchParams.get('point'));
		locate();
		start();
		return stop;
	});
	async function start() {
		try {
			stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment', width: { ideal: 1920 } }, audio: false });
			camState = app.draft?.photos.length ? 'review' : 'live';
			await Promise.resolve();
			if (video) { video.srcObject = stream; await video.play(); }
		} catch { camState = 'denied'; }
	}
	function stop() { stream?.getTracks().forEach((t) => t.stop()); }
	function stampLocation() {
		app.draft.lat = here.lat; app.draft.lng = here.lng; app.draft.accuracy = here.accuracy;
		if (!app.draft.point) app.draft.point = nearestPoint(here.lat, here.lng).id;
	}
	async function shoot() {
		if (!video) return;
		app.draft.photos.push(await compress(video)); stampLocation(); save(); camState = 'review';
	}
	async function pickFile(e) {
		const f = e.target.files?.[0]; if (!f) return;
		app.draft.photos.push(await compress(await fileToDataUrl(f))); stampLocation(); save(); camState = 'review';
	}
	async function again() { camState = 'live'; await Promise.resolve(); if (video && stream) { video.srcObject = stream; video.play(); } }
	function close() { if (!app.draft?.photos.length) app.draft = null; save(); goto('/home'); }
	const locLabel = $derived(here.status === 'locating' ? 'Finding your location…' : here.status === 'ready' ? `Location ready · ±${here.accuracy} m` : 'Location off: we use the water point you pick');
</script>

<div class="cam">
	<div class="top">
		<button class="icon-btn light" aria-label="Close" onclick={close}><IconX size={24} /></button>
		<span class="loc" class:wait={here.status === 'locating'}><IconMapPin size={16} />{locLabel}</span>
	</div>

	{#if camState === 'review'}
		<div class="review">
			<img src={app.draft.photos.at(-1)} alt="What you just took" />
			<p class="body hint">{app.draft.photos.length} of 2 photos. Add a second from a different angle if you can.</p>
		</div>
		<div class="controls stack gap-sm">
			<div class="btn-row">
				<button class="btn secondary" onclick={() => { app.draft.photos.pop(); save(); again(); }}>Retake</button>
				{#if app.draft.photos.length < 2}<button class="btn tonal" onclick={again}>Add another</button>{/if}
			</div>
			<button class="btn primary" onclick={() => goto('/report/check')}>Next: check</button>
		</div>
	{:else if camState === 'denied'}
		<div class="denied stack gap-lg">
			<IconCameraOff size={40} />
			<h1 class="h3">Camera is off</h1>
			<p class="body">MajiMap needs the camera to take a photo of the problem. You can allow it in your browser’s site settings, or choose a photo you already took.</p>
			<button class="btn accent" onclick={() => fileInput.click()}><IconPhoto size={20} />Choose a photo</button>
		</div>
	{:else}
		<!-- svelte-ignore a11y_media_has_caption -->
		<video bind:this={video} playsinline muted class="view"></video>
		<div class="frame" aria-hidden="true"></div>
		<p class="body hint">Point at the problem. Include the pump, pipe or tap.</p>
		<div class="shutter-row">
			<button class="gallery" onclick={() => fileInput.click()} aria-label="Choose from gallery"><IconPhoto size={24} /><span class="body-s">Gallery</span></button>
			<button class="shutter" aria-label="Take photo" onclick={shoot} disabled={camState !== 'live'}></button>
			<span style="width:64px"></span>
		</div>
	{/if}
	<input bind:this={fileInput} type="file" accept="image/*" capture="environment" hidden onchange={pickFile} />
</div>

<style>
	.cam { position: fixed; inset: 0; max-width: 480px; margin: 0 auto; background: #0b1318; color: #fafcfb; display: flex; flex-direction: column; }
	.top { position: absolute; top: 0; left: 0; right: 0; z-index: 3; display: flex; align-items: center; gap: 8px; padding: calc(8px + env(safe-area-inset-top)) 8px 8px; }
	.light { color: #fafcfb; }
	.loc { display: inline-flex; align-items: center; gap: 4px; background: rgb(255 255 255 / 0.16); padding: 4px 10px; border-radius: 999px; font-size: 12px; font-weight: 500; }
	.loc.wait { background: rgb(230 188 107 / 0.3); }
	.view { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
	.frame { position: absolute; left: 24px; right: 24px; top: 22%; height: 40%; border: 2px dashed rgb(255 255 255 / 0.7); border-radius: 16px; z-index: 2; }
	.hint { position: absolute; left: 16px; right: 16px; bottom: calc(140px + env(safe-area-inset-bottom)); text-align: center; z-index: 2; text-shadow: 0 1px 2px #000; }
	.shutter-row { position: absolute; left: 0; right: 0; bottom: calc(24px + env(safe-area-inset-bottom)); display: flex; align-items: center; justify-content: space-between; padding: 0 24px; z-index: 2; }
	.gallery { width: 64px; display: flex; flex-direction: column; align-items: center; gap: 4px; background: none; border: 0; color: inherit; cursor: pointer; }
	.shutter { width: 76px; height: 76px; border-radius: 50%; background: #fafcfb; border: 6px solid rgb(255 255 255 / 0.35); background-clip: padding-box; cursor: pointer; }
	.review { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 72px 16px 16px; gap: 16px; }
	.review img { max-width: 100%; max-height: 60vh; border-radius: 16px; }
	.review .hint { position: static; }
	.controls { padding: 16px 16px calc(16px + env(safe-area-inset-bottom)); }
	.denied { margin: auto 16px; padding-top: 72px; }
</style>
