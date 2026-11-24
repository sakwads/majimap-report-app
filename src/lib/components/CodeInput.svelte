<script>
	import IconAlert from '@tabler/icons-svelte/icons/alert-circle';
	let { length = 6, value = $bindable(''), masked = false, error = '', label = 'Code', oncomplete = null, autofocus = true } = $props();
	let focused = $state(false);
	let el;
	function onInput(e) {
		value = e.target.value.replace(/\D/g, '').slice(0, length);
		e.target.value = value;
		if (value.length === length) oncomplete?.(value);
	}
	$effect(() => { if (autofocus && el) el.focus(); });
</script>

<div class="code stack gap-sm" class:pin={masked}>
	<div class="boxes" class:err={!!error}>
		<input
			bind:this={el}
			class="real"
			{value}
			oninput={onInput}
			onfocus={() => (focused = true)}
			onblur={() => (focused = false)}
			inputmode="numeric"
			autocomplete={masked ? 'off' : 'one-time-code'}
			maxlength={length}
			aria-label={label}
			aria-invalid={!!error}
			type={masked ? 'password' : 'text'}
		/>
		{#each Array(length) as _, i}
			<span class="box" class:focus={focused && !error && i === Math.min(value.length, length - 1)} class:filled={i < value.length}>
				{#if i < value.length}
					{#if masked}<span class="dotm"></span>{:else}{value[i]}{/if}
				{:else if focused && !error && i === value.length}<span class="caret"></span>{/if}
			</span>
		{/each}
	</div>
	{#if error}<p class="error-text" role="alert"><IconAlert size={16} />{error}</p>{/if}
</div>

<style>
	.boxes { position: relative; display: flex; gap: var(--space-sm); }
	.box {
		flex: 1 1 0; height: 56px; border-radius: var(--radius-md); border: 1px solid var(--border-input); background: var(--surface-raised);
		display: flex; align-items: center; justify-content: center; font-size: 20px; line-height: 28px; font-weight: 500;
	}
	.pin .box { flex: 0 0 56px; }
	.box.focus { border-color: var(--border-brand); box-shadow: 0 0 0 3px color-mix(in srgb, var(--border-focus) 30%, transparent); }
	.err .box { border: 2px solid var(--border-error); }
	.real { position: absolute; inset: 0; opacity: 0; width: 100%; height: 100%; font-size: 16px; caret-color: transparent; z-index: 1; }
	.caret { width: 2px; height: 24px; background: var(--text-default); animation: blink 1s steps(1) infinite; }
	.dotm { width: 12px; height: 12px; border-radius: 50%; background: var(--text-default); }
	@keyframes blink { 50% { opacity: 0; } }
</style>
