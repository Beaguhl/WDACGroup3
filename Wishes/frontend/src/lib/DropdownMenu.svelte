<script>
	import {slide, fly} from 'svelte/transition'

	import MenuItem from './MenuItem.svelte'
	let activeMenu = 'main'
	let menuHeight = 0
	let menuEl = null

	$: menuHeight = menuEl?.offsetHeight ?? 0
</script>

<div class="dropdown stack" style="height: {menuHeight}px">
	{#if activeMenu === 'main'}
		<div class="menu" in:fly={{ x: -300 }} out:fly={{ x: -300 }} bind:this={menuEl}>
			<MenuItem on:click={() => activeMenu = "profile"}>Login</MenuItem>
			<MenuItem on:click={() => activeMenu = "settings"}>Settings</MenuItem>
		</div>
	{/if}

	{#if activeMenu === 'profile'}
		<div class="menu" in:fly={{x:300}} out:fly={{x:300}} bind:this={menuEl}>
			<MenuItem on:click={() => activeMenu = "main"}>Back</MenuItem>
			<MenuItem>Setting 1</MenuItem>
			<MenuItem>Setting 2</MenuItem>
			<MenuItem>Setting 3</MenuItem>
			<MenuItem>Setting 4</MenuItem>
			<MenuItem>Setting 5</MenuItem>
			<MenuItem>Setting 6</MenuItem>
			<MenuItem>Setting 7</MenuItem>
		</div>
	{/if}
</div>

<style>

	.dropdown {
		position: absolute;
		top: 58px;
		width: 300px;
		transform: translateX(-45%);
		background-color: var(--bg);
		border: var(--border);
		border-radius: var(--border-radius);
		padding: 1rem;
		overflow: hidden;
		transition: height var(--speed) ease;
	}
	
	.stack {
		display: grid;
		align-items: start; /* allow to shrink */
	}
	
	.stack > :global(*) {
		grid-area: 1 / 1;
  }
	
	.menu {
		width: 100%;
	}

</style>
