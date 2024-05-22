<script>
	import { user } from "../user-store";
	import { Router, Link, Route } from "svelte-routing";
	import Product from "./Product.svelte";

	let isFetchingProducts = true;
	let isUnAuthorized = false;
	let products = [];
	let isServerError = false;
	let searchedProducts = [];
	let startedSearch = false;
	let isFetchingSearchedProdcucts = true;
	let showAllProducts = null;

	async function loadAllProducts() {
		showAllProducts = true;
		try {
			const response = await fetch("http://localhost:8080/products", {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: "bearer " + $user.accessToken,
					UserID: $user.userID,
				},
			});

			switch (response.status) {
				case 200:
					products = await response.json();
					isFetchingProducts = false;
					break;

				case 401:
					isUnAuthorized = true;
					isFetchingProducts = false;
					break;

				case 500:
					isServerError = true;
					break;

				case 404:
					break;
			}
		} catch (error) {
			console.log(error);
		}
	}

	async function searchProducts(event) {
		showAllProducts = false;
		startedSearch = true;
		const formData = new FormData(event.target);
		const searchString = formData.get("q");

		try {
			const response = await fetch(
				"http://localhost:8080/products/search?q=" + searchString,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Authorization: "bearer " + $user.accessToken,
						UserID: $user.userID,
					},
				}
			);

			switch (response.status) {
				case 200:
					searchedProducts = await response.json();
					isFetchingSearchedProdcucts = false;
					break;

				case 404:
					isFetchingSearchedProdcucts = false;
					break;
			}
		} catch (error) {
			console.log(error);
		}
	}
	loadAllProducts();
</script>

{#if $user.isLoggedIn}
	<Router>
		<section>
			<div class="container">
				<div class="squareContainer">
					<div class="container">
						<h1>Find Products</h1>
						<form on:submit|preventDefault={searchProducts}>
							<div class="search-container">
								<input type="text" name="q" placeholder="Filter products..." />
								<button type="submit" id="search-button">Filter</button>
								<button
									type="button"
									id="show-all-button"
									on:click={loadAllProducts}>Show All Products</button
								>
							</div>
						</form>
						<div class="search-container" />
						<div class="product-container">
							{#if showAllProducts == false}
								{#if startedSearch}
									{#if isFetchingSearchedProdcucts}
										<p>Searching...</p>
									{:else if searchedProducts.length == 0}
										<p>No search result found</p>
									{:else}
										{#each searchedProducts as searchedProduct}
											<Link
												class="Links"
												to="/products/{searchedProduct.productID}"
											>
												<h3>{searchedProduct.productName}</h3>
											</Link>
										{/each}
									{/if}
								{/if}
							{:else}
								{#each products as product}
									<Link class="Links" to="/products/{product.productID}">
										<div class="object">
											<h3 class="cursor">{product.productName}</h3>
											<p>{product.description}</p>
										</div>
									</Link>
								{/each}
							{/if}
						</div>
					</div>
				</div>
			</div>
		</section>
		<main>
			<Route path="/products" component={Product} />
		</main>
	</Router>
{:else}
	<p>You need to be logged in to an account to view products</p>
{/if}

<style>
	* {
		box-sizing: border-box;
		margin: 0;
		padding: 0;
	}

	.object {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.cursor {
		cursor: pointer;
	}

	h1 {
		text-align: center;
		margin-bottom: 20px;
		color: rgb(212, 247, 213);
	}

	h3 {
		color: white;
	}

	h3:hover {
		color: rgb(143, 249, 205);
		text-decoration: underline;
	}

	.container {
		max-width: 960px;
		margin: 0 auto;
		padding: 20px;
	}

	.search-container {
		display: flex;
		align-items: center;
		margin-bottom: 20px;
	}

	.search-container input[type="text"] {
		flex: 1;
		padding: 10px;
		border: none;
		border-bottom: 2px solid #ccc;
	}

	.search-container button {
		margin-left: 10px;
		padding: 10px;
		border: none;
		background-color: #333;
		color: #fff;
		cursor: pointer;
	}

	.search-container button:hover {
		background-color: #555;
	}

	.product-container {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		grid-gap: 20px;
	}

	p {
		color: white;
	}
</style>
