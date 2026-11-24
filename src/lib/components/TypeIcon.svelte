<script>
	import IconDroplet from '@tabler/icons-svelte/icons/droplet';
	import IconDropletOff from '@tabler/icons-svelte/icons/droplet-off';
	import IconDropletHalf from '@tabler/icons-svelte/icons/droplet-half-2';
	import IconMessageReport from '@tabler/icons-svelte/icons/message-report';
	let { type, size = 20 } = $props();
	const map = { 'no-water': IconDropletOff, broken: IconDroplet, leak: IconDropletHalf };
	const Ic = $derived(map[type] || IconMessageReport);
</script>

<Ic {size} />
