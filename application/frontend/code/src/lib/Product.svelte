<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.3.0/css/all.min.css">

<script>
	import {Router, Link} from 'svelte-routing'
	import { user } from "../user-store"

	export let id
	let isFetchingProduct = true
	let failedToFetchProduct = false
	let fetchedProduct = null
	let alreadyInList = false
	let somethingWentWrong = false

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
					alreadyInList = true
					break

			}
		} catch(error) {
			console.log(error)
			somethingWentWrong = true
		}
	}

	async function loadProduct(){
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
					console.log("fetched product id: " + fetchedProduct.productID)
					console.log(fetchedProduct.productIsInWishList)
					isFetchingProduct = false
					break
				
				case 404:
					isFetchingProduct = false
					break

			}
		}catch(error){
			somethingWentWrong = true
			console.log(error)
			failedToFetchProduct = true
		}
	}

	loadProduct()

	async function addProductToWishList(productID){
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
					loadProduct()
					break
				
				case 500:
					console.log("500 error")
					break
			}
		} catch(error) {
			somethingWentWrong = true
			console.log(error)
		}
	}
</script>

{#if somethingWentWrong}
	<p>Something went wrong.</p>
{:else}
	<Router>
		<div class="mainContent">
			{#if $user.isLoggedIn}

				{#if isFetchingProduct}
					<p>Wait, fetching data...</p>
				{:else if failedToFetchProduct}
					<p>Couldn't fetch product. Check your Internet connection.</p>
				{:else if fetchedProduct}
				<div class="card">
					<h1 class="card-title">
						{fetchedProduct.product.productName}
					</h1>
					<h2 class="card-subtitle">
						{fetchedProduct.product.description}
					</h2>
					
					{#if fetchedProduct.productIsInWishList}
						<p class="alreadyInWish">this product is already in your wishlist</p>
					{:else}
						<button class="card-button" on:click={() => addProductToWishList(fetchedProduct.product.productID)}>

							Add to WishList
						</button>
					{/if}
						{#if $user.admin}
						<Link class="Links" to="/products/{id}/update" id="update-product-link" style="color: white; text-decoration: none; margin-right: 40px;">
							<button class="update-button">
								Update Product
							</button>
						</Link>
						<Link class="Links" to="/products/{id}/delete" id="delete-product-link" style="color: white; text-decoration: none; margin-right: 40px">
							<button class="delete-button">
								Delete Product
							</button>
						</Link>
						{/if}
					</div>
				{/if}
			{/if}
		</div>
	</Router>
{/if}

<style>
	.mainContent{
		height: 80vh;
		padding: 0;
		margin: 0;
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		grid-template-rows: 1fr 1fr 1fr;
		grid-template-areas: 
		". . ."
		". mid ."
		". . .";
	}
	.card {
		grid-area: mid;
		display: grid;
		grid-template-areas: 
		"cardTop cardTop cardTop"
		"cardMid cardMid cardMid"
		"cardBotLeft cardBotMid cardBotRight";
		background-color: gray;
		border-radius: 5px;
		text-align: center;
		width: 600px;
	}

	.card-title {
		grid-area: cardTop;
		font-size: 60px;
		font-weight: bold;
		margin-bottom: 10px;
	}

	.card-subtitle {
		grid-area: cardMid;
		font-size: 20px;
		color: lightgray;
		margin-bottom: 20px;
	}

	.alreadyInWish{
		grid-area: cardBotMid;
	}

	.update-button{
		grid-area: cardBotRight;
		position: relative;
		left: 15%;
		top: 25%;
		background-color: #2A7BE6;
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

	.delete-button{
		grid-area: cardBotLeft;
		position: relative;
		left:15%;
		top: 25%;
		background-color: #F32626;
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

	.card-button {
		position: relative;
		left: 5%;
		top: 25%;
		grid-area: cardBotMid;
		background-color:#3e8e41;
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
