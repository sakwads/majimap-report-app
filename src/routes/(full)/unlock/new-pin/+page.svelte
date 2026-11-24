<script>
	import { goto } from '$app/navigation';
	import PinStep from '$lib/components/PinStep.svelte';
	import { app, save, hashPin, setUnlocked } from '$lib/store.svelte.js';
	async function onsave(pin) {
		app.pinHash = await hashPin(pin); save(); setUnlocked(true); goto('/home');
	}
</script>

<PinStep title="Create a new PIN" intro="Your reports and messages are still here. Do not use your M-PESA PIN." help="This replaces your old PIN on this phone." {onsave} />
