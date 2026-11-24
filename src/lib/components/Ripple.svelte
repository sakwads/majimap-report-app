<!-- Brand ripple from the MajiMap mark: decorative, behind content, never on maps or the camera. -->
<div class="ripple" aria-hidden="true">
	<svg viewBox="0 0 448 448" width="448" height="448">
		{#each [[58, 0.16], [109, 0.12], [160, 0.08], [211, 0.05]] as [r, o]}
			<circle cx="224" cy="224" {r} fill="none" stroke="var(--border-brand)" stroke-width="2" opacity={o} />
		{/each}
	</svg>
</div>

<style>
	.ripple { position: fixed; top: calc(500px - 224px); right: calc(24px - 224px); pointer-events: none; z-index: 0; }
	@media (min-width: 480px) { .ripple { right: calc(50vw - 240px + 24px - 224px); } }
</style>
