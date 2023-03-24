<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.3.0/css/all.min.css">


<script>
	import { user } from "../user-store";
	import {Router, Link, Route} from "svelte-routing"
	import Product from "./Product.svelte";
	import { onMount } from "svelte";


	export let id

	let isFetchingProduct = true
	let fetchedProduct = null

	let newProductName = ""
	let newProductDescription = ""

	let succesfulProductNameUpdate = false
	let succesfulProductDescriptionUpdate = false

	async function getProductToUpdate(){
		console.log("AAAAAAAAAAAAAAAAAAAAAAAA")
		try {
			console.log(id)
			const response = await fetch(`http://localhost:8080/products/${id}/update` ,{
			  
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
					console.log("fetched not name: " + fetchedProduct.length)
					console.log("fetched: " + fetchedProduct[0].productName)
					newProductName = fetchedProduct[0].productName
					newProductDescription = fetchedProduct[0].description
					break

				case 404:
					break

				
			}
		}catch(error){
		}
	}

	getProductToUpdate()

	async function updateProduct(){
		try{
			const response = await fetch(`http://localhost:8080/products/${id}/update`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					"Authorization": "bearer "+$user.accessToken,
					"UserID": $user.userID,
				},
				body: JSON.stringify({
					NewProductName: newProductName,
					NewProductDescription: newProductDescription
				}),
			})

			switch(response.status){
				case 200:
					console.log("YEEEEEEEEEES")
					succesfulProductNameUpdate = true
					succesfulProductDescriptionUpdate = true
					break
				
				case 500:
					console.log("NOOOOOO")
					break

				case 400:
					console.log("MAAAAAAYBEEEEEE")
					break
			}
		}catch(error){

		}
	}

	/**
	 * @param {{ preventDefault: () => void; }} event
	 */
	async function handleUpdate(event){
		event.preventDefault()

		try{
			const response = await updateProduct()
			console.log("Name: " + newProductName)
			console.log("Desc: " + newProductDescription)
		}catch(error){

		}

		
	}



</script>

<div class="container">
	{#if fetchedProduct}
		<form on:submit={handleUpdate}>
			<div class="form-group">
				<label for="fetchedProductName">Product Name:</label>
				<div class="underline-textfield">
					<input type="text" id="fetchedProductName" name="fetchedProduct" bind:value={newProductName}>
				</div>
				<label for="fetchedProductDescription">Description</label>
				<div class="underline-textfield">
					<input type="text" id="fetchedProductDescription" name="fetchedProduct" bind:value={newProductDescription}>
				</div>
				<div class="form-group">
					<input type="submit" value="Update product">
				</div>
			</div>
		

		</form>
	{/if}
</div>

<style>
	.container {
	margin: 50px auto;
	padding: 30px;
	border-radius: 10px;
	box-shadow: 0 0 10px rgba(0,0,0,0.1);
	width: 600px;
}

p {
    color: white;
}

h1 {
	font-size: 36px;
	margin-bottom: 20px;
	text-align: center;
    color: rgb(212, 247, 213);
}

form {
	margin-top: 30px;
}

.form-group {
	margin-bottom: 20px;
	display: flex;
	flex-direction: column;
}

label {
	display: block;
	margin-bottom: 10px;
	font-size: 24px;
	color: white;
    margin-right: 100px;
}

.underline-textfield {
	position: relative;
	margin-bottom: 20px;
}

.underline-textfield input[type="text"],
.underline-textfield input[type="password"] {
	padding: 10px;
	font-size: 24px;
	border: none;
	background: none;
	outline: none;
	color: white;
}

.underline-textfield::after {
	content: "";
	position: absolute;
	bottom: 0;
	left: 0;
	height: 2px;
	width: 100%;
	background-color: rgb(212, 247, 213);
}


input[type="submit"] {
	background-color: #276047;
	border: none;
	border-radius: 5px;
	padding: 10px;
	font-size: 24px;
	cursor: pointer;
	margin-left: 10px;
	color: white;
    margin-left: 10px;
}

input[type="submit"]:first-child {
	margin-left: auto;
}

input{
    color: rgb(255, 255, 255);
}
</style>