
<script>
	import {Router, Link, Route} from 'svelte-routing'
	import StartPage from "./lib/StartPage.svelte"
	import SearchUsers from './lib/SearchUsers.svelte'
	import FindProducts from './lib/FindProducts.svelte'
	import DropdownMenu from './lib/DropdownMenu.svelte'
	import NavBar from './lib/NavBar.svelte'
	import NavItem from './lib/NavItem.svelte'
	import Button from './lib/Button.svelte';
</script>


<Router>
	<div class="mainDiv">
			<h1 class="wishes">
				<Link class="Links" to="/">Wishes</Link>
			</h1>
			<nav class="navBar">
				<Link class="Links" to="/FindWishes">Find Wishes</Link>
				<Link class="Links" to="/FindUsers">Find Users</Link>
			</nav>
			<NavBar>
				<NavItem>
					<span slot="trigger">
						<Button></Button>
					</span>
					<DropdownMenu></DropdownMenu>
				</NavItem>
			</NavBar>
	</div>
	<main>
		<Route path="/" component="{StartPage}"></Route>
		<Route path="/FindUsers" component="{SearchUsers}"></Route>
		<Route path="/FindWishes" component="{FindProducts}"></Route>
	</main>
</Router>



<style>
	:global(body){
		margin: 0;
		padding: 0;
		height: 100vh;
		width: 100%;
	}

	main{
		z-index: 1;
		width: 100vw;
	}

	.mainDiv{
		display: flex;
		width: 100vw;
		height: 13vh;
		background-color: purple;
		z-index: 2;
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

</style>

