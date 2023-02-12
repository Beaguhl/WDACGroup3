<!--  Svelte port of React example: https://github.com/fireship-io/229-multi-level-dropdown -->
<script>
	// @ts-ignore
	import {Router, Link, Route} from 'svelte-routing'
	import StartPage from "./lib/StartPage.svelte"
	import SearchUsers from './lib/SearchUsers.svelte'
	import FindProducts from './lib/FindProducts.svelte'
	import DropdownMenu from './lib/DropdownMenu.svelte'
	import NavBar from './lib/NavBar.svelte'
	import NavItem from './lib/NavItem.svelte'
	import SpecificUser from './lib/SpecificUser.svelte'
	import IconButton from './lib/IconButton.svelte'
  import LoggedInDropDown from './lib/LoggedInDropDown.svelte';
	import Following from './lib/Following.svelte'
	import MyWishList from './lib/MyWishList.svelte'
	import Followers from './lib/Followers.svelte'

	import SpecificProduct from './lib/SpecificProduct.svelte';

	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	let currentRoute = '';

onMount(async () => {
  currentRoute = window.location.pathname;
});

const findWishesColor = writable('white')
const findUsersColor = writable('white')

window.addEventListener('popstate', () => {
  currentRoute = window.location.pathname;
});


</script>


<Router>
	<div class="mainDiv">
		<button on:click={() => {
			findUsersColor.set('white')
			findWishesColor.set('white')
		}}>
			<h1 class="wishes">
				<Link class="Links" to="/">Wishes</Link>
			</h1>

		</button>
			<nav class="navBar">
				<button class="testButton {$findWishesColor}" on:click={() => {
					findWishesColor.set('aqua');
					findUsersColor.set('white')
				}}>
					<Link class="Links" to="/FindWishes">Find Wishes</Link>
				</button>
				<button class="testButton {$findUsersColor}" on:click={() => {
					findUsersColor.set('aqua')
					findWishesColor.set('white')
				}}>
					<Link class="Links" to="/FindUsers">Find Users</Link>
				</button>
				

			<nav class="navBar link">
				<Link class="Links" to="/FindWishes">Find Wishes</Link>
				<Link class="Links" to="/FindUsers">Find Users</Link>
				<Link class="MyFriends" to="/MyFriends"></Link>

				<Link class="Links" to="/SpecificUser">Specific user</Link>

			</nav>
			

			{#if $findWishesColor === 'aqua'}
				<script>
					buttonColor.set('aqua');
				</script>
			{/if}

			{#if $findWishesColor === 'white'}
				<script>
					buttonColor.set('white');
				</script>
			{/if}
			<div>
				<NavBar>
					<NavItem>
						<span slot="trigger">
							Login
						</span>
							<!-- <DropdownMenu></DropdownMenu> -->
							<LoggedInDropDown></LoggedInDropDown>
					</NavItem>
				</NavBar>
			</div>
			
	</div>
	<main>
		<Route path="/" component="{StartPage}"></Route>
		<Route path="/FindUsers" component="{SearchUsers}"></Route>
		<Route path="/FindWishes" component="{FindProducts}"></Route>
		<Route path="/SpecificUser" component="{SpecificUser}"></Route>

		<Route path="/SpecificProduct" compenent="{SpecificProduct}"></Route>

		<Route path="/Following" component="{Following}"></Route>
		<Route path="/MyWishList" component="{MyWishList}"></Route>
		<Route path="/Followers" component="{Followers}"></Route>

	</main>
</Router>



<style>
	:global(body){
		margin: 0;
		padding: 0;
		height: 100vh;
		width: 100%;
		background: #151616;

	}


	.link:hover :global(a){
		color: purple
	}

	.link:visited :global(a){
		background-color: aqua;
	}

	.findWishes:link, .findWishes:visited :global(a){
		color: aqua;
	}

	.findWishes:hover :global(a){
		color: purple;
	}

	main{
		z-index: 1;
		width: 100vw;
	}

	.mainDiv{
		display: flex;
		width: 100vw;
		background-color: #242526;
		z-index: 2;
		color: white;
	}


	.navBar{
		margin-top: 4%;
		display: flex;
		justify-content: space-around;
		align-items: flex-start;
		width: 100%;
		z-index: 1;
	}

	.wishes{
		display: flex;
		width: fit-content;
		float: left;
		margin-left: 5%;
	}

	:root {
		--bg: #242526;
		--bg-accent: #484a4d;
		--text-color: #dadce1;
		--nav-size: 60px;
		--border: 1px solid #474a4d;
		--border-radius: 8px;
		--speed: 200ms; 
	}

	:global(body) {
		margin: 0;
		padding: 0;
		background: #151616;
		font-family: Helvetica;
	}

	.white{
		background-color: white;
	}

	.aqua {
		background-color: aqua;
	}
</style>

