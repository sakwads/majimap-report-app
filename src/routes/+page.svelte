<script>
	import { goto } from '$app/navigation';
	import { app, session } from '$lib/store.svelte.js';
	$effect(() => { goto(!app.signedIn ? '/sign-in' : session.unlocked ? '/home' : '/unlock', { replaceState: true }); });
</script>
