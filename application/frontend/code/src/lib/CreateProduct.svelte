<script>
// @ts-nocheck

	import { Router, Route, navigate } from "svelte-routing";
	import StartPage from "./StartPage.svelte";
	import { user } from "../user-store";

	let productName = "";
	let description = "";
	let errors = [];
	let productCreated = false;

	async function createProduct() {
		const product = {
			productName,
			description,
		};

		console.log("accestoken är: ", $user.accessToken)
		try {
			const response = await fetch("http://localhost:8080/products", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: "bearer " + $user.accessToken,
				},
				body: JSON.stringify(product),
			});
			switch (response.status) {
				case 201:
					productCreated = true;
					navigate("/products");
					break;

				case 400:
					errors = await response.json();
					console.log(errors)
					break;
			}
		} catch (error) {
			console.log(error);
			errors = [errors, "COMMUNICATION_ERROR"]
		}
	}
</script>

{#if $user.isLoggedIn}
	{#if $user.admin}
		<Router>
			<h1>Create Product</h1>
			<form on:submit|preventDefault={createProduct}>
				<div>
					<label for="productName">Product Name:</label>
					<input type="text" name="" id="" bind:value={productName} />
				</div>
		
				<div>
					<label for="description">Product Description:</label>
					<input type="text" name="" id="" bind:value={description} />
				</div>
				<input type="submit" value="Create Product" />
			</form>
		
			{#if errors.length > 0}
				<p>Errors detected!</p>
				<ul>
					{#each errors as error}
						<li>{error}</li>
					{/each}
				</ul>
			{/if}
			
			<Route path="/StartPage" component={StartPage} />
		</Router>
	{:else}
		<p>You need to be an admin to create product</p>
	{/if}

{:else}
	<p>You need to be logged in to create product</p>
{/if}

<style>
	h1,
	p {
		text-align: center;
	}
	h1 {
		color: rgb(255, 255, 255);
	}

	ul {
		text-align: center;
		color: rgb(255, 255, 255);
	}

	body {
		font-family: Arial, Helvetica, sans-serif;
		font-size: 16px;
	}

	h1 {
		font-size: 2rem;
		margin-bottom: 1rem;
	}

	form {
		max-width: 400px;
		margin: 0 auto;
	}

	label {
		display: block;
		margin-bottom: 0.5rem;
		color: rgb(255, 255, 255);
	}

	input[type="text"] {
		width: 100%;
		padding: 0.5rem;
		margin-bottom: 1rem;
		border: 1px solid #ccc;
		border-radius: 4px;
		box-sizing: border-box;
	}

	input[type="submit"] {
		background-color: #4caf50;
		color: white;
		padding: 0.5rem 1rem;
		border: none;
		border-radius: 4px;
		cursor: pointer;
	}

	p {
		color: red;
		font-weight: bold;
	}

	ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	li {
		margin-bottom: 0.5rem;
	}
</style>
