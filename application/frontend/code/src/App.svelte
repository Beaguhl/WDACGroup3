<!--  Svelte port of React example: https://github.com/fireship-io/229-multi-level-dropdown -->
<script>
	import { Router, Route, Link, navigate } from "svelte-routing";
	import StartPage from "./lib/StartPage.svelte";

	import Products from "./lib/Products.svelte";

	import User from "./lib/User.svelte";

	import jwt_decode from "jwt-decode";
	import Following from "./lib/Following.svelte";
	import MyWishList from "./lib/MyWishList.svelte";
	import Followers from "./lib/Followers.svelte";
	import Users from "./lib/Users.svelte";
	import Product from "./lib/Product.svelte";
	import CreateUser from "./lib/CreateUser.svelte";
	import MyAccount from "./lib/MyAccount.svelte";
	import CreateProduct from "./lib/CreateProduct.svelte";
	import { onMount } from "svelte";

	import { user } from "./user-store";

	import UpdateProduct from "./lib/UpdateProduct.svelte";
	import DeleteProduct from "./lib/DeleteProduct.svelte";

	let currentRoute = "";

	onMount(async () => {
		currentRoute = window.location.pathname;
	});
	window.addEventListener("popstate", () => {
		currentRoute = window.location.pathname;
	});

	let username = "";
	let password = "";
	let body = null;
	let noMatch = false;
	let closedDropDown = true;
	let emptyField = false;
	let dropdownShown = false;

	function logout() {
		$user.isLoggedIn = false;
		navigate("/");

	}

	async function login() {
		try {
			const response = await fetch("http://16.16.193.202:8080/tokens", {
				method: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
				body: `grant_type=password&username=${encodeURIComponent(
					username
				)}&password=${encodeURIComponent(password)}`,
			});
			switch (response.status) {
				case 200:
					body = await response.json();
					const jwtDecoded = jwt_decode(body.id_token);
					//@ts-ignore
					const userID = jwtDecoded.sub;

					$user = {
						isLoggedIn: true,
						accessToken: body.access_token,
						userID: userID,
						admin: body.admin,
					};
					closedDropDown = true;
					username = "";
					password = "";
					emptyField = false;
					dropdownShown = false;
					noMatch = false;
					break;

				case 400:
					noMatch = true;
					break;

				case 403:
					emptyField = false;
					noMatch = true;
					break;
			}
		} catch (error) {
			console.log(error);
		}
	}

	function toggleDropDown() {
		dropdownShown = !dropdownShown;
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
				<div class="dropdown">
					<button class="dropbtn" on:click={toggleDropDown}>Login</button>
					{#if dropdownShown}
						<div class="dropdown-content">
							<Router>
								<main>
									<form on:submit|preventDefault={login}>
										<div class="form-group">
											<label class="form-label" for="username"
												>Username:</label
											>
											<input
												class="form-input"
												type="text"
												id="username"
												name="username"
												bind:value={username}
											/>
										</div>
										<div class="form-group">
											<label class="form-label" for="password"
												>Password:
											</label>
											<input
												class="form-input"
												type="password"
												id="password"
												name="password"
												bind:value={password}
											/>
										</div>
										<button class="form-btn" id="pointer" type="submit"
											>Login</button
										>
									</form>
									<!-- svelte-ignore a11y-click-events-have-key-events -->
									<div on:click|preventDefault={toggleDropDown}>
										<Link
											class="Links create-account-link"
											to="/create-account"
											style="font-size: small; color: #fff;"
											>Don't have an Account? Create account.</Link
										>
									</div>
									{#if emptyField}
										<p class="error-message">No field can be left empty</p>
									{/if}
									{#if noMatch}
										<p class="error-message">
											Username and password is not a match
										</p>
									{/if}
									<Route path="/create-account" component={CreateUser} />
								</main>
							</Router>
						</div>
					{/if}
				</div>
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

	.form-label {
		font-weight: bold;
		margin-bottom: 5px;
		font-size: 14px;
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

	#pointer {
		cursor: pointer;
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
		background-color: #4caf50;
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


