<script>
	import { page } from '$app/stores';
	import IconHome from '@tabler/icons-svelte/icons/home';
	import IconClipboard from '@tabler/icons-svelte/icons/clipboard-list';
	import IconDroplet from '@tabler/icons-svelte/icons/droplet';
	import { app } from '$lib/store.svelte.js';
	const tabs = [
		{ href: '/home', label: 'Home', Ic: IconHome },
		{ href: '/reports', label: 'Reports', Ic: IconClipboard },
		{ href: '/nearby', label: 'Nearby water', Ic: IconDroplet }
	];
	const unread = $derived(app.reports.some((r) => r.message && !r.message.reply && !app.seenMessages.includes(r.id)));
</script>

<nav class="nav" aria-label="Main">
	{#each tabs as t}
		{@const active = $page.url.pathname.startsWith(t.href) || ($page.url.pathname.startsWith('/account') && t.href === '/home')}
		<a href={t.href} class="tab" class:active aria-current={active ? 'page' : undefined}>
			<span class="pill"><t.Ic size={24} />{#if t.href === '/reports' && unread}<span class="badge-dot" aria-label="New message"></span>{/if}</span>
			<span class="label-s">{t.label}</span>
		</a>
	{/each}
</nav>

<style>
	.nav {
		position: fixed; left: 0; right: 0; bottom: 0; z-index: 30; display: flex; background: var(--surface-raised);
		border-top: 1px solid var(--border-default); padding: 8px 8px calc(8px + env(safe-area-inset-bottom)); max-width: 480px; margin: 0 auto;
	}
	.tab { flex: 1 1 0; display: flex; flex-direction: column; align-items: center; gap: 4px; color: var(--text-secondary); padding: 4px 0; }
	.pill { position: relative; width: 64px; height: 32px; border-radius: var(--radius-pill); display: flex; align-items: center; justify-content: center; }
	.active { color: var(--text-brand); }
	.active .pill { background: var(--action-primary); color: var(--text-on-brand); }
	.badge-dot { position: absolute; top: 2px; right: 14px; width: 8px; height: 8px; border-radius: 50%; background: var(--status-faulty-text); border: 2px solid var(--surface-raised); }
</style>
