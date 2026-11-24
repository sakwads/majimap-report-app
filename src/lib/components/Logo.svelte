<script>
	let { size = 40, wordmark = true } = $props();
</script>

<span class="logo" style="height:{size}px">
	<svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
		<circle cx="32" cy="36" r="25.5" stroke="var(--logo-ring-outer)" stroke-width="3" />
		<circle cx="32" cy="36" r="17" stroke="var(--logo-ring-inner)" stroke-width="3" />
		<path d="M32 22s-7.5 8.6-7.5 13.6a7.5 7.5 0 0 0 15 0C39.5 30.6 32 22 32 22Z" fill="var(--logo-drop)" />
	</svg>
	{#if wordmark}
		<span class="word" style="font-size:{size * 0.6}px"><b>Maji</b><i>Map</i></span>
	{:else}
		<span class="sr-only">MajiMap</span>
	{/if}
</span>

<style>
	.logo { display: inline-flex; align-items: center; gap: 6px; }
	.word { font-weight: 700; letter-spacing: -0.02em; line-height: 1; }
	.word b { color: var(--logo-drop); font-weight: 700; }
	.word i { font-style: normal; color: var(--logo-ring-inner); }
</style>
