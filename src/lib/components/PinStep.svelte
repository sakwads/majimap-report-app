<script>
	import Logo from './Logo.svelte';
	import CodeInput from './CodeInput.svelte';
	let { title, intro, help, onsave } = $props();
	let pin = $state('');
</script>

<Logo size={40} />
<div class="stack gap-2xs">
	<h1 class="h2">{title}</h1>
	<p class="body-s secondary">{intro}</p>
</div>
<CodeInput length={4} masked bind:value={pin} label="4-digit PIN" />
<div class="grow"></div>
<div class="stack gap-sm">
	<button class="btn primary" disabled={pin.length < 4} onclick={() => onsave(pin)}>Save PIN</button>
	<p class="body-s secondary">{help}</p>
</div>
