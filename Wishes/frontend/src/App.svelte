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

</script>


<Router>
	<div class="mainDiv">
			<h1 class="wishes">
				<Link class="Links" to="/">Wishes</Link>
			</h1>
			<nav class="navBar link">
				<Link class="Links" to="/FindWishes">Find Wishes</Link>
				<Link class="Links" to="/FindUsers">Find Users</Link>


				<Link class="Links" to="/SpecificUser">Specific user</Link>

			</nav>
			<div>
				<NavBar>
					<NavItem>
						<span slot="trigger">
							Login
						</span>
						<DropdownMenu></DropdownMenu>
					</NavItem>
				</NavBar>
			</div>
			
	</div>
	<main>
		<Route path="/" component="{StartPage}"></Route>
		<Route path="/FindUsers" component="{SearchUsers}"></Route>
		<Route path="/FindWishes" component="{FindProducts}"></Route>
		<Route path="/SpecificUser" component="{SpecificUser}"></Route>
	</main>
</Router>



<style>
	:global(body){
		margin: 0;
		padding: 0;
		height: 100vh;
		width: 100%;
	}

	.link > :global(a){
		text-decoration: none;
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

</style>

