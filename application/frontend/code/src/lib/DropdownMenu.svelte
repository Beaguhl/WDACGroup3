<script>
	import {slide, fly} from 'svelte/transition'
    import { user } from '../user-store';
	import Input from './Input.svelte';

	import MenuItem from './MenuItem.svelte'

	let activeMenu = 'main'
	let menuHeight = 0
	let menuEl = null

	$: menuHeight = menuEl?.offsetHeight ?? 0

	let menuOpen = false;
	let inputUsername = ""
	let inputPassword = ""
	$:console.log(inputUsername)
	
	const menuItems = ["About", "Base", "Blog", "Contact", "Custom", "Support", "Tools", "Boats", "Cars", "Bikes", "Sheds", "Billygoats", "Zebras", "Tennis Shoes", "New Zealand"];
	let filteredItems = [];
	
	const handleInput = () => {
		return filteredItems = menuItems.filter(item => item.toLowerCase().match(inputUsername.toLowerCase()))
	}
</script>

<div class="dropdown stack" style="height: {menuHeight}px">
	{#if $user.isLoggedIn}
		<div class="menu" in:fly={{ x: -400 }} out:fly={{ x: -400 }} bind:this={menuEl}>
			<Input bind:inputUsername on:input={handleInput}/>
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
		top: 125px;
		width: 300px;
		transform: translateX(-45%);
		background-color: var(--bg);
		border: var(--border);
		border-radius: var(--border-radius);
		padding: 1rem;
		overflow: hidden;
		transition: height var(--speed) ease;
		z-index: 3;
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
