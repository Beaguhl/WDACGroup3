<!--  Svelte port of React example: https://github.com/fireship-io/229-multi-level-dropdown -->
<script>
	import {Router, Route, Link, navigate} from 'svelte-routing'
	import StartPage from "./lib/StartPage.svelte"

	import Products from './lib/Products.svelte'

	import User from './lib/User.svelte'


	import Following from './lib/Following.svelte'
	import MyWishList from './lib/MyWishList.svelte'
	import Followers from './lib/Followers.svelte'
    import Users from './lib/Users.svelte';
	import Product from './lib/Product.svelte'
	import CreateUser from './lib/CreateUser.svelte'
	import MyAccount from './lib/MyAccount.svelte'
	import CreateProduct from './lib/CreateProduct.svelte'
	import { onMount } from 'svelte';

	import { user } from './user-store'

	import UpdateProduct from './lib/UpdateProduct.svelte';
	import DeleteProduct from './lib/DeleteProduct.svelte';

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
	let emptyField = false
	let dropdownShown = false

	

	export let openBar = false
	function toggleBar(){
		openBar = !openBar
	}

	function logout(){
		$user.isLoggedIn = false
		navigate("/")
	}


	async function login() {
    try {
      console.log("Userud is" + $user.userID)
      const response = await fetch("http://localhost:8080/tokens", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: `grant_type=password&username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
      })
      switch (response.status) {
        case 200:
          body = await response.json()
          console.log("nu kommer logged in token: " + body.access_token)

          $user = {
            isLoggedIn: true,
            accessToken: body.access_token,
            userID: body.userID,
            admin: body.admin
          }
          closedDropDown = true
		  	username = ""
    		password = ""
			emptyField = false
			dropdownShown = false
          break

        case 400:
          emptyField = true
          console.log("case 400")
          break
      }
    } catch (error) {
    }
  }

  function toggleDropDown() {
    dropdownShown = !dropdownShown
  }
	
</script>


<Router>
	<nav>
		<div>
			<Link class="Links active" id="home-link" to="/" style="color: white; text-decoration: none; margin-right: 70px; font-weight: bold;">Wishes</Link>		
			{#if $user.isLoggedIn}
				<Link class="Links" to="/users" id="users-link" style="color: white; text-decoration: none; margin-right: 40px;">Find Users</Link>
				<Link class="Links" to="/products" id="products-link" style="color: white; text-decoration: none; margin-right: 40px;">Find Products</Link>
				<Link class="Links" to="/my-wishlist" id="mywishlist-link" style="color: white; text-decoration: none; margin-right: 40px;">My WishList</Link>
				<Link class="Links" to="/follows/followers" id="followers-link" style="color: white; text-decoration: none; margin-right: 40px;">My Followers</Link>
				<Link class="Links" to="/follows/followings" id="followings-link" style="color: white; text-decoration: none; margin-right: 40px;">My Followings</Link>
				<Link class="Links" to="/my-account" id="my-account-link" style="color: white; text-decoration: none; margin-right: 40px;">My Account</Link>
				{#if $user.admin}
					<Link class="Links" to="/create-products" id="create-product-link" style="color: white; text-decoration: none; margin-right: 40px;">Create Product</Link>
				{/if}
				
			{/if}
			
		</div>
		<div>
			

			{#if $user.isLoggedIn}
				<button id="logout" on:click={logout}> Logout </button>
			{:else}
				<div class="dropdown">
					<button class="dropbtn" on:click={toggleDropDown}>Login</button>
					{#if dropdownShown}

						<div class="dropdown-content">
							<Router>
								<main>
								<form on:submit|preventDefault={login}>
									<div class="form-group">
									<label class="form-label" for="username">Username:</label>
									<input class="form-input" type="text" id="username" name="username" bind:value={username}>
									</div>
									<div class="form-group">
									<label class="form-label" for="password">Password:</label>
									<input class="form-input" type="password" id="password" name="password" bind:value={password}>
									</div>
									<button class="form-btn" id="pointer" type="submit">Login</button>
								</form>
								<div >
									<Link class="Links create-account-link"  to="/create-account" style="font-size: small; color: #fff;">Don't have an Account? Create account.</Link>
								</div>
								{#if emptyField}
									<div class="error-message">
									<p>No field can be left empty</p>
									</div>
								{/if}
								<Route path="/create-account" component="{CreateUser}"></Route>
								</main>
							</Router>
						</div>
					{/if}
					
				</div>
			{/if}

		  	

		</div>
	  </nav>

	<main>
		<Route path="/" component="{StartPage}"></Route>
		<Route path="/users" component="{Users}"></Route>
		<Route path="/products" component="{Products}"></Route>
		<Route path="/users/:id" component="{User}"></Route>
		<Route path="/create-account" component="{CreateUser}"></Route>
		<Route path="/products/:id" component="{Product}"></Route>
		<Route path="/my-account" component="{MyAccount}"></Route>
		<Route path="/follows/followings" component="{Following}"></Route>
		<Route path="/my-wishlist" component="{MyWishList}"></Route>
		<Route path="/follows/followers" component="{Followers}"></Route>
		<Route path="/create-products" component="{CreateProduct}"></Route>
		<Route path="/products/:id/update" component="{UpdateProduct}"></Route>
		<Route path="/products/:id/delete" component="{DeleteProduct}"></Route>
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

#logout{
	background-color: gray;
	color: white;
}

#pointer{
	cursor: pointer;
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

	.dropdown {
        position: relative;
        display: inline-block;
    }

    .dropdown-content {
        position: absolute;
        z-index: 1;
		left: -240px;
		background-color: #333;
		padding: 20px;
    }

    .dropdown-content a {
        display: block;
        text-align: left;
    }

    

    .dropbtn {
        color: white;
        background-color: transparent;
        border: none;
        font-size: 16px;
        cursor: pointer;
    }

    .dropbtn:hover {
        text-decoration: underline;
    }


	
  
.stack {
  display: grid;
  align-items: start;
}
  
.stack > :global(*) {
  grid-area: 1 / 1;
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 5px;
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
  cursor: pointer;
  width: 300px;
  font-size: 14px;
}

.error-message {
  margin-top: 5px;
  color: red;
  font-size: 14px;
}




</style>