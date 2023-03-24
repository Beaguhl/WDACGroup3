<script>
	import { user } from "../user-store"
	import { Router, Link, Route, navigate } from "svelte-routing"
	import { onMount } from "svelte";
	import Products from "./Products.svelte";

	export let id
	let isFetchingProduct = true
	let fetchedProduct = null
	let failedToFetchProduct = false

	let successfulProductDelete = false

	async function loadProductToDelete(){
		
		try{
			const response = await fetch(`http://localhost:8080/products/${id}/delete`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					"Authorization": "bearer " + $user.accessToken,
					"UserID": $user.userID
				}
			})
			switch(response.status){
				case 200:
					fetchedProduct = await response.json()
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
	
	loadProductToDelete()

	async function deleteProduct(){
		
		try{
			const response = await fetch(`http://localhost:8080/products/${id}/delete`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					"Authorization": "bearer " +$user.accessToken,
					"UserID": $user.userID
				},
				body: JSON.stringify({})
			})
			switch(response.status){
				case 200:
					console.log("YAY!")
					successfulProductDelete = true

				case 500:
					console.log("NOT YAY!")
					break

				case 400:
					console.log("yay?")
					break

			}
		}catch(error){

		}
	}


	/**
	 * @param {{ preventDefault: () => void; }} event
	 */
	async function handleDelete(event){
		event.preventDefault()

		try{
			await deleteProduct()
			console.log("I GOT HERE SOMEHOW....")
			navigate("/products")
		}catch(error){

		}
	}

</script>

<div class="mainContent">
	{#if fetchedProduct}
	<div class="card">
		<div class="form-group">
				<h1 class="card-title">Are you sure you want to delete {fetchedProduct[0].productName}</h1>
			</div>
				<button class="yes-button" on:click={handleDelete}>Yes</button>
			<Link class="Links" to="/products/{id}">
				<button class="no-button">No</button>
			</Link>
	</div>
			
	{/if}
</div>

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

	.card{
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

	.card-title{
		grid-area: cardTop;
		font-size: 30px;
		font-weight: bold;
		margin-bottom: 10px;
	}

	.yes-button{
		grid-area: cardBotLeft;
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

	.no-button{
		grid-area: cardBotRight;
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
</style>