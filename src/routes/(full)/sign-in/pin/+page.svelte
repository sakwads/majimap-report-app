<script>
	import { goto } from '$app/navigation';
	import PinStep from '$lib/components/PinStep.svelte';
	import { app, save, hashPin, setUnlocked } from '$lib/store.svelte.js';
	import { biometricAvailable } from '$lib/auth/biometric.js';
	async function onsave(pin) {
		app.pinHash = await hashPin(pin);
		app.signedIn = true;
		save();
		setUnlocked(true);
		goto((await biometricAvailable()) ? '/sign-in/fingerprint' : '/home');
	}
</script>

<PinStep title="Create a 4-digit PIN" intro="You will use it to open MajiMap on this phone. Do not use your M-PESA PIN." help="You can change it later in Account." {onsave} />
