
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.3.0/css/all.min.css">

<script>

	import { user } from "../user-store"

	export let id
	let isFetchingProduct = true
	let failedToFetchProduct = false
	let fetchedProduct = null
	let alreadyInList = false

	async function isInWishList(productID){
		try {
			const response = await fetch("http://localhost:8080/wishlist-product/" + productID, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Authorization": "bearer "+$user.accessToken,
					"UserID": $user.userID
				}
			})

			switch(response.status){
				case 200:
					console.log("not in the wishlist")
					alreadyInList = true
					break

			}
		} catch(error) {

		}
	}

	async function loadProduct(){
		console.log("inside loadProduct")
		try {
			const response = await fetch("http://localhost:8080/products/" + id, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					"Authorization": "bearer "+$user.accessToken,
					"UserID": $user.userID
				}
			})

			switch(response.status){
				case 200:
					fetchedProduct = await response.json()
					console.log("fetched product: " + fetchedProduct.product.productName)
					console.log(fetchedProduct.productIsInWishList)
					isFetchingProduct = false
					break
				
				case 404:
					isFetchingProduct = false
					break

			}
		}catch(error){
			failedToFetchProduct = true
		}
		
	}

	loadProduct()

	

	async function addProductToWishList(productID){
		console.log("got in this product id to add: " + productID)
		try {
			const response = await fetch("http://localhost:8080/wishlist-product/" + productID, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Authorization": "bearer "+$user.accessToken,
					"UserID": $user.userID
				}
			})

			switch(response.status){
				case 200:
					break
				
				case 500:
					console.log("500 error")
					break
			}
		} catch(error) {

		}
	}

 

</script>

<!------------ HTML code ----------->





	{#if $user.isLoggedIn}

		{#if isFetchingProduct}
			<p>Wait, fetching data...</p>
		{:else if failedToFetchProduct}
			<p>Couldn't fetch product. Check your Internet connection.</p>
		{:else if fetchedProduct}
		<div class="flex">
			<div class="card">
				<h1 class="card-title">
					{fetchedProduct.product.productName}
				</h1>
				<h2 class="card-subtitle">
					{fetchedProduct.product.description}
				</h2>
				{#if fetchedProduct.productIsInWishList}
					<p>this product is already in your wishlist</p>
				{:else}
					<button class="card-button" on:click={() => addProductToWishList(fetchedProduct.productID)}>
						Add to WishList
					</button>
				{/if}
				
			</div>
		</div>
		{/if}
	{/if}



<style>
	

	.flex{
		display: flex;
		justify-content: center;
	}

	.card {
		margin-top: 150px;
		border-radius: 5px;
		text-align: center;
		width: 600px;
	}

	.card-title {
		font-size: 120px;
		font-weight: bold;
		margin-bottom: 10px;
	}

	.card-subtitle {
		font-size: 40zpx;
		color: #888888;
		margin-bottom: 20px;
	}

	.card-button {
		background-color: #4CAF50;
		border: none;
		color: white;
		padding: 10px 20px;
		text-align: center;
		text-decoration: none;
		display: inline-block;
		font-size: 16px;
		border-radius: 5px;
		cursor: pointer;
		transition: background-color 0.3s ease;
	}

	.card-button:hover {
		background-color: #3e8e41;
	}

</style>
