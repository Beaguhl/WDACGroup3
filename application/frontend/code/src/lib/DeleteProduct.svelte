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

<div class="container">
	{#if fetchedProduct}
			<div class="form-group">
				<h1>Are you sure you want to delete {fetchedProduct[0].productName}</h1>
			</div>
				<button on:click={handleDelete}>Yes</button>
			<Link class="Links" to="/products/{id}">
				<button>No</button>
			</Link>
	{/if}
</div>