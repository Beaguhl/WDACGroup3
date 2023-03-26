<script>
	import { user } from "../user-store";
	import { Link, navigate } from "svelte-routing";

	export let id;
	let isFetchingProduct = true;
	let fetchedProduct = null;
	let failedToFetchProduct = false;

	let successfulProductDelete = false;

	async function loadProductToDelete() {
		try {
			const response = await fetch(`http://localhost:8080/products/${id}`, {
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
					isFetchingProduct = false;
					break;

				case 404:
					isFetchingProduct = false;
					break;
			}
		} catch (error) {
			failedToFetchProduct = true;
		}
	}

	loadProductToDelete();

	async function deleteProduct() {
		try {
			const response = await fetch(`http://localhost:8080/products/${id}`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					Authorization: "bearer " + $user.accessToken,
					UserID: $user.userID,
				},
				body: JSON.stringify({}),
			});
			switch (response.status) {
				case 204:
					successfulProductDelete = true;

				case 500:
					break;

				case 400:
					break;
			}
		} catch (error) {}
	}

	/**
	 * @param {{ preventDefault: () => void; }} event
	 */
	async function handleDelete(event) {
		event.preventDefault();

		try {
			await deleteProduct();
			navigate("/products");
		} catch (error) {}
	}
</script>

<div class="mainContent">
	{#if fetchedProduct}
		<div class="card">
			<h1 class="card-title">
				Are you sure you want to delete {fetchedProduct.product.productName}
			</h1>
			<p class="card-subtitle">{fetchedProduct.product.description}</p>
			<Link
				class="Links"
				to=""
				id="null"
				style="color: white; text-decoration: none; margin-right: 40px;"
			>
				<button class="yes-button" on:click={handleDelete}>Yes</button>
			</Link>
			<p class="emptyGridSpace" />
			<Link class="Links" to="/products/{id}">
				<button class="no-button">No</button>
			</Link>
		</div>
	{/if}
</div>

<style>
	.mainContent {
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
		grid-template-columns: 1fr 1fr 1fr;
		grid-template-rows: 1fr 1fr 1fr;
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
		font-size: 30px;
		font-weight: bold;
		margin-bottom: 10px;
		text-align: center;
	}

	.card-subtitle {
		grid-area: cardMid;
		font-size: 20px;
		color: lightgray;
		margin-bottom: 20px;
	}

	.yes-button {
		grid-area: cardBotLeft;
		background-color: #f32626;
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

	.emptyGridSpace {
		grid-area: cardBotMid;
	}

	.no-button {
		grid-area: cardBotRight;
		background-color: #2a7be6;
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
