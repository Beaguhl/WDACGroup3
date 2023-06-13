<!--  Svelte port of React example: https://github.com/fireship-io/229-multi-level-dropdown -->
<script>
// @ts-nocheck

	import { Router, Route, Link, navigate } from "svelte-routing";
	import { onMount } from "svelte";
	import { user } from "./user-store";
	import Following from "./lib/Following.svelte";
	import MyWishList from "./lib/MyWishList.svelte";
	import Followers from "./lib/Followers.svelte";
	import Users from "./lib/Users.svelte";
	import Product from "./lib/Product.svelte";
	import CreateUser from "./lib/CreateUser.svelte";
	import MyAccount from "./lib/MyAccount.svelte";
	import CreateProduct from "./lib/CreateProduct.svelte";
	import UpdateProduct from "./lib/UpdateProduct.svelte";
	import DeleteProduct from "./lib/DeleteProduct.svelte";
	import StartPage from "./lib/StartPage.svelte";
	import Products from "./lib/Products.svelte";
	import User from "./lib/User.svelte";
	import Dropdown from "./lib/Dropdown.svelte";
	
	let currentRoute = "";

	onMount(async () => {
		currentRoute = window.location.pathname;
	});
	window.addEventListener("popstate", () => {
		currentRoute = window.location.pathname;
	});

	function logout() {
		$user.isLoggedIn = false;
		navigate("/");
	}

</script>

<Router>
	<nav>
		<div>
			<Link
				class="Links active"
				id="home-link"
				to="/"
				style="color: white; text-decoration: none; margin-right: 70px; font-weight: bold;"
				>Wishes</Link
			>
			{#if $user.isLoggedIn}
				<Link
					class="Links"
					to="/users"
					id="users-link"
					style="color: white; text-decoration: none; margin-right: 40px;"
					>Find Users</Link
				>
				<Link
					class="Links"
					to="/products"
					id="products-link"
					style="color: white; text-decoration: none; margin-right: 40px;"
					>Find Products</Link
				>
				<Link
					class="Links"
					to="/my-wishlist"
					id="mywishlist-link"
					style="color: white; text-decoration: none; margin-right: 40px;"
					>My WishLists</Link
				>
				<Link
					class="Links"
					to="/followers"
					id="followers-link"
					style="color: white; text-decoration: none; margin-right: 40px;"
					>My Followers</Link
				>
				<Link
					class="Links"
					to="/followings"
					id="followings-link"
					style="color: white; text-decoration: none; margin-right: 40px;"
					>My Followings</Link
				>
				<Link
					class="Links"
					to="/my-account"
					id="my-account-link"
					style="color: white; text-decoration: none; margin-right: 40px;"
					>My Account</Link
				>
				{#if $user.admin}
					<Link
						class="Links"
						to="/create-products"
						id="create-product-link"
						style="color: white; text-decoration: none; margin-right: 40px;"
						>Create Product</Link
					>
				{/if}
			{/if}
		</div>
		<div>
			{#if $user.isLoggedIn}
				<button id="logout" on:click={logout}> Logout </button>
			{:else}
				<svelte:component this={Dropdown} />
			{/if}
		</div>
	</nav>

	<main>
		<Route path="/" component={StartPage} />
		<Route path="/users" component={Users} />
		<Route path="/products" component={Products} />
		<Route path="/users/:id" component={User} />
		<Route path="/create-account" component={CreateUser} />
		<Route path="/products/:id" component={Product} />
		<Route path="/my-account" component={MyAccount} />
		<Route path="/followings" component={Following} />
		<Route path="/my-wishlist" component={MyWishList} />
		<Route path="/followers" component={Followers} />
		<Route path="/create-products" component={CreateProduct} />
		<Route path="/products/:id/update" component={UpdateProduct} />
		<Route path="/products/:id/delete" component={DeleteProduct} />
	</main>
</Router>

<style>
	:global(body) {
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

	#logout {
		background-color: gray;
		color: white;
	}

	main {
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
</style>


