<script>
	import { user } from "../user-store";
	import { navigate } from "svelte-routing";

	export let id;

	let fetchedProduct = null;

	let newProductName = "";
	let newProductDescription = "";

	let succesfulProductNameUpdate = false;
	let succesfulProductDescriptionUpdate = false;

	let productErrors = [];
	let productNameError = "";
	let productDesriptionError = "";

	async function getProductToUpdate() {
		try {
			const response = await fetch(`http://16.16.193.202:8080/products/${id}`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: "bearer " + $user.accessToken,
					UserID: $user.userID,
				},
			});
			switch (response.status) {
				case 200:
					fetchedProduct = await response.json();
					newProductName = fetchedProduct.product.productName;
					newProductDescription = fetchedProduct.product.description;
					break;

				case 404:
					break;
			}
		} catch (error) {
			console.log(error);
		}
	}

	getProductToUpdate();

	async function updateProduct() {
		try {
			const response = await fetch(`http://16.16.193.202:8080/products/${id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: "bearer " + $user.accessToken,
					UserID: $user.userID,
				},
				body: JSON.stringify({
					NewProductName: newProductName,
					NewProductDescription: newProductDescription,
				}),
			});
			switch (response.status) {
				case 200:
					succesfulProductNameUpdate = true;
					succesfulProductDescriptionUpdate = true;
					productErrors = [];
					navigate("/products");
					break;

				case 500:
					break;

				case 400:
					const body = await response.json();
					productErrors = body.productErrors;
					break;
			}
		} catch (error) {
			console.log(error);
		}
	}
</script>

<link
	rel="stylesheet"
	href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.3.0/css/all.min.css"
/>
{#if $user.isLoggedIn}
	<div class="container">
		{#if fetchedProduct}
			<form on:submit|preventDefault={updateProduct}>
				<div class="form-group">
					<label for="fetchedProductName">Product Name:</label>
					<div class="underline-textfield">
						<input
							type="text"
							id="fetchedProductName"
							name="fetchedProduct"
							bind:value={newProductName}
						/>
					</div>
					<label for="fetchedProductDescription">Description</label>
					<div class="underline-textfield">
						<input
							type="text"
							id="fetchedProductDescription"
							name="fetchedProduct"
							bind:value={newProductDescription}
						/>
					</div>
					<div class="form-group">
						<input type="submit" value="Update product" />
					</div>
					<ul>
						{#each productErrors as error}
							<li>{error}</li>
						{/each}
					</ul>
				</div>
			</form>
		{/if}
	</div>
{/if}

<style>
	.container {
		margin: 50px auto;
		padding: 30px;
		border-radius: 10px;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
		width: 600px;
	}

	form {
		margin-top: 30px;
	}

	.form-group {
		margin-bottom: 20px;
		display: flex;
		flex-direction: column;
	}

	ul {
		list-style-type: none;
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

	.underline-textfield input[type="text"] {
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

	input {
		color: rgb(255, 255, 255);
	}
</style>
