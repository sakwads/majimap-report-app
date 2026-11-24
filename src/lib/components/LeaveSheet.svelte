<script>
	let { open = $bindable(false), onleave } = $props();
</script>

{#if open}
	<div class="scrim" onclick={() => (open = false)} role="presentation"></div>
	<div class="sheet" role="dialog" aria-modal="true" aria-labelledby="ltitle">
		<h2 id="ltitle" class="h4">Leave this report?</h2>
		<p class="body secondary">We keep it as a draft on this phone, with your photo, so you can finish it later.</p>
		<button class="btn primary" onclick={onleave}>Keep draft and leave</button>
		<button class="btn secondary" onclick={() => (open = false)}>Stay</button>
	</div>
{/if}
