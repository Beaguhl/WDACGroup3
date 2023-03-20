<!--  Svelte port of React example: https://github.com/fireship-io/229-multi-level-dropdown -->
<script>
	import {Router, Link, Route} from 'svelte-routing'
	import StartPage from "./lib/StartPage.svelte"
	import SearchUsers from './lib/Users.svelte'
	import Products from './lib/Products.svelte'
	import DropdownMenu from './lib/DropdownMenu.svelte'
	import NavBar from './lib/NavBar.svelte'
	import NavItem from './lib/NavItem.svelte'
	import User from './lib/User.svelte'
	import IconButton from './lib/IconButton.svelte'
	import LoggedInDropDown from './lib/LoggedInDropDown.svelte'
	import Following from './lib/Following.svelte'
	import MyWishList from './lib/MyWishList.svelte'
	import Followers from './lib/Followers.svelte'
    import Users from './lib/Users.svelte';
	import Product from './lib/Product.svelte'
	import CreateUser from './lib/CreateUser.svelte'
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { user } from './user-store'
    import { text } from 'svelte/internal';

	let currentRoute = ''
	const currentPage = window.location.pathname;
  
onMount(async () => {
  currentRoute = window.location.pathname;
});
window.addEventListener('popstate', () => {
  currentRoute = window.location.pathname;
});
	
let username = ""
    let password = ""
    let body = null
    let accessToken = null
    let noMatch = false
    let closedDropDown = true

    async function login(){
        console.log("clicked login")
        try {
            const response = await fetch("http://localhost:8080/tokens", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: `grant_type=password&username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
            })

            switch(response.status){
                case 200:
                    body = await response.json()
                    //accessToken = body.access_token
                    console.log("nu kommer logged in token: " + body.access_token)

                    $user = {
                        isLoggedIn: true,
                        accessToken: body.access_token
                    }
                    closedDropDown = false
                    break

                case 400:
                    noMatch = true
                    console.log("case 400")
                    break
            }
        } catch (error){

        }
    }
	export let openBar = false
	function toggleBar(){
		openBar = !openBar
	}
	
</script>


<Router>
	<nav>
		<div>
			<Link class="Links active" id="home-link" to="/" style="color: white; text-decoration: none; margin-right: 70px; font-weight: bold;">Wishes</Link>		
		  {#if $user.isLoggedIn}
			<Link class="Links" to="/users" id="users-link" style="color: white; text-decoration: none; margin-right: 40px;">Find Users</Link>
			<Link class="Links" to="/products" id="products-link" style="color: white; text-decoration: none; margin-right: 40px;">Find Products</Link>
			<Link class="Links" to="/MyWishList" id="mywishlist-link" style="color: white; text-decoration: none; margin-right: 40px;">My WishList</Link>
			<Link class="Links" to="/Followers" id="followers-link" style="color: white; text-decoration: none; margin-right: 40px;">My Followers</Link>
			<Link class="Links" to="/following" id="followings-link" style="color: white; text-decoration: none; margin-right: 40px;">My Followings</Link>
			{/if}
			
		</div>
		<div>

		  <NavItem>
			<span slot="trigger" on:click={toggleBar}>
				Login
			</span>
			{#if openBar}
				<LoggedInDropDown on:clickOutside={toggleBar}></LoggedInDropDown>
			{/if}

		</NavItem>

		</div>
	  </nav>

	  <!--

								<Link class="Links" to="/MyWishList" id="users-link" style="color: black; padding: 12px 16px; text-decoration: none; display: block;">My WishList</Link>




							<form on:submit|preventDefault={login}>
							<div class="form-group">
								<label class="form-label" for="username">Username:</label>
								<input class="form-input" type="text" id="username" name="username" bind:value={username}>
							</div>
							<div class="form-group">
								<label class="form-label" for="password">Password:</label>
								<input class="form-input" type="password" id="password" name="password" bind:value={password}>
							</div>
							<button class="form-btn" type="submit">Login</button>
						</form>
						<Link class="Links create-account-link" to="/create-account" style="font-size: small; color: #fff;">Don't have an Account? Create account.</Link>
						-->


	<!--
<div class="mainDiv">
		<button id="homeButton">
			<h1 class="wishes">
				<Link class="Links" to="/">Wishes</Link>
			</h1>
		</button>
		{#if $user.isLoggedIn}
			<nav class="navBar">
				<Link class="Links" to="/users">
						<button class="testButton" id="users">Find Users</button>		
				</Link>
				<Link class="Links" to="/products">
					<button class="testButton" id="products">
						Find Products
					</button>
				</Link>
				<Link class="Links" to="/products">
					Product
				</Link>
			
			</nav>
		{/if}
			
			
			<div>
				<NavBar>
					<NavItem>
						<span slot="trigger">
							Login
						</span>
							<LoggedInDropDown></LoggedInDropDown>
					</NavItem>
				</NavBar>
			</div>
			
	</div>
	-->
	<main>
		<Route path="/" component="{StartPage}"></Route>
		<Route path="/users" component="{Users}"></Route>
		<Route path="/products" component="{Products}"></Route>
		<Route path="/user/:id" component="{User}"></Route>
		<Route path="/create-account" component="{CreateUser}"></Route>
		<Route path="/products/:id" component="{Product}"></Route>

		<Route path="/following" component="{Following}"></Route>
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
	nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #333;
    color: #fff;
    padding: 10px;
  }

.droptxt {
  color: white;
  padding: 16px;
  font-size: 16px;
  border: none;
  cursor: pointer;
}

.dropdown-content {
  display: none;
  position: absolute;
  z-index: 1;
  background-color: #333;
  min-width: 250;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  right: 0;
  border-color: #484a4d;
  border-width: 1px;
}

.dropdown:hover .dropdown-content {
  display: block;
}


  
	main{
		z-index: 1;
		width: 100vw;
	}
	
	:root {
		--bg: #242526;
		--bg-accent: #484a4d;
		--text-color: #dadce1;
		--nav-size: 60px;
		--border: 1px solid #474a4d;
		--border-radius: 8px;
		--speed: 20ms; 
	}
	:global(body) {
		margin: 0;
		padding: 0;
		background: #151616;
		font-family: Helvetica;
	}
	button{
		background-color: darkgray;
		color: white;
		padding: 10px 20px;
		border-radius: 5px;
		border: none;
		cursor: pointer;
		font-size: 16px;
	}


	.form-group {
  display: flex;
  flex-direction: column;
  margin: 10px;
}

.form-label {
  font-weight: bold;
  margin-bottom: 5px;
  font-size: 14px;
}

.form-input {
  padding: 3px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 290px;
  font-size: 14px;
}

.form-btn {
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 7px;
  margin-left: 10px;
  margin-bottom: 10px;
  cursor: pointer;
  width: 300px;
  font-size: 14px;
}
</style>