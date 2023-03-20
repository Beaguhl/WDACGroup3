<script>

	import {Router, Link, Route} from 'svelte-routing'
	import Product from './Product.svelte';
	import {onMount} from 'svelte'

	let isFetchingProducts = true
	let isUnAuthorized = false
	let products = []
	let isServerError = false
	let searchedProducts = []
	let startedSearch = false
	let isFetchingSearchedProdcucts = true
	let showAllProducts = null

	async function loadAllProducts() {
		showAllProducts = true
		try{
			const response = await fetch("http://localhost:8080/products", {
				method: "GET",
				headers: {
					"Content-Type": "application/json"
					
				}
			})
			
			switch(response.status){
				case 200:
					products = await response.json()
					isFetchingProducts = false
					break

				case 401:
					isUnAuthorized = true
					isFetchingProducts = false
					break

				case 404:
					isFetchingSearchedProdcucts = false
					break
				
				case 500:
					isServerError = true
					break
		} 
	}catch(error){

	}
}

	async function searchProducts(event){
		showAllProducts = false
		startedSearch = true
		const formData = new FormData(event.target)
		const searchString = formData.get('searchString')

		try{
			const response = await fetch("http://localhost:8080/products/search?searchString=" + searchString, {
				method: "GET",
				headers: {
					"Content-Type": "application/json"
				}
			})

			switch(response.status){
				case 200:
					searchedProducts = await response.json()
					isFetchingSearchedProdcucts = false
					break
				
				case 404:
					isFetchingSearchedProdcucts = false
					break
			}
		}catch(error){

		}
	}


</script>

<Router>
	<section>
		<div class="container">
			<div class="squareContainer">
				<div class="container">
					<h1>Find Products</h1>
					<form on:submit|preventDefault={searchProducts}>
						<div class="search-container">
							<input type="text" name="searchString" placeholder="Search for products...">
							<button type="submit" id="search-button">Search</button>
							<button type="button" id="show-all-button" on:click={loadAllProducts}>Show All Users</button>
						</div>
					</form>
					<div class="search-container"></div>
					<div class="product-container">
					{#if !showAllProducts}
						{#if startedSearch}
							{#if isFetchingSearchedProdcucts}
								<p>Searching...</p>
							{:else}
								{#if searchedProducts.length == 0}
									<p>No search result found</p>
								{:else}
									{#each searchedProducts as searchedProduct}
										<Link class="Links" to="/product/{searchedProduct.productID}">
											<h3>{searchedProduct.productName}</h3>
										</Link>
									{/each}
								{/if}
							{/if}
						{/if}
					{:else if showAllProducts}
						{#if isFetchingProducts}
							<p>Wait, I'm loading</p>
						{:else if isServerError}
							<p>Internal server error, try again later</p>
						{/if}
						{#each products as searchedProductIndex}
							<Link class="Links" to="/user/{searchedProductIndex.productID}">
								<h3>{searchedProductIndex.productName}</h3>
							</Link>
						{/each}
					{/if}
					</div>
				</div> 
			</div>
		</div>
	</section>
	<main>
<!-- Här ska Route vara -->
		<Route path="Product" component="{Product}"></Route>
	</main>
</Router>


<style>

	* {
		box-sizing: border-box;
		margin: 0;
		padding: 0;
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

	.imageSize{
		width: 10vw;
		height: 20vh;
	}

	.container{
		max-width: 960px;
		margin: 0 auto;
		padding: 20px
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

	.profilePicture{
	  margin-top: 10%;
	  display: flex;
	  justify-content: center;
	}

	.text{
	  display: flex;
	  justify-content: center;
	  margin-top: 4%;
	  font-size: x-large;
	  font-weight: bolder;
	  color: black;
	}

	.square{
		width: 85%;
		height: 100%;
		border-radius: 20px;
		z-index: 2;
		box-shadow: 5px 5px 5px 2px;
		margin-bottom: 5%;
		margin-left: 6%;
		margin-right: 2%;
		background-color: rgba(94, 127, 132, 0.418);
	}
	
	p {
		color: white;
	}

</style>