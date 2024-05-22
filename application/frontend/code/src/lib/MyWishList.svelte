<script>
	import { user } from "../user-store";

	export let id = $user.userID;
	let wishListProducts = [];

	let listIsEmpty = true;

	let showSearch = false;

	async function loadWishList() {
		try {
			const response = await fetch("http://13.53.123.120:8080/wishlist/" + id, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: "bearer " + $user.accessToken,
					UserID: $user.userID,
				},
			});

			switch (response.status) {
				case 200:
					wishListProducts = await response.json();
					listIsEmpty = false;
					showSearch = false;
					break;

				case 500:
					break;

				case 404:
					break;
			}
		} catch (error) {
			console.log(error);
		}
	}

	loadWishList();

	let searchResults = [];

	async function searchProducts(event) {
		const formData = new FormData(event.target);
		const searchString = formData.get("q");

		try {
			const response = await fetch(
				"http://13.53.123.120:8080/wishlist/" + id + "/search?q=" + searchString,
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
					searchResults = await response.json();
					showSearch = true;
					break;

				case 404:
					searchResults = [];
					showSearch = true;
					break;
			}
		} catch (error) {
			console.log(error);
		}
	}
</script>

{#if $user.isLoggedIn}
	<section>
		<div class="container">
			<div class="squareContainer">
				<div class="container">
					<h1>My Wish List</h1>
					<form on:submit|preventDefault={searchProducts}>
						<div class="search-container">
							<input type="text" name="q" placeholder="Filter wish products..." />
							<button type="submit" id="search-button">Filter</button>
							<button type="button" id="show-all-button" on:click={loadWishList}
								>Show All Wish Products</button
							>
						</div>
					</form>
					<div class="search-container" />
					<div class="user-container">
						{#if showSearch}
							{#if searchResults.length != 0}
								{#each searchResults as result}
									<div class="object">
										<h3>{result[0].productName}</h3>
										<p>{result[0].description}</p>
									</div>
								{/each}
							{:else}
								<p>No wishlist products found</p>
							{/if}
						{:else if wishListProducts.length != 0}
							{#each wishListProducts as product}
								<div class="object">
									<h3>{product[0].productName}</h3>
									<p>{product[0].description}</p>
								</div>
							{/each}
						{:else}
							<p>You do not have any products in your wishlist at the moment</p>
						{/if}
					</div>
				</div>
			</div>
		</div>
	</section>
{:else}
	<p>You need to be logged in to view my wish list</p>
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

	.container {
		max-width: 960px;
		margin: 0 auto;
		padding: 20px;
	}

	h1 {
		text-align: center;
		margin-bottom: 20px;
		color: rgb(212, 247, 213);
	}

	h3 {
		color: white;
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

	.user-container {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		grid-gap: 20px;
	}

	p {
		color: white;
	}
</style>
