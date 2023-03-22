<script>
	import {Router, Link, Route} from 'svelte-routing'
	import { get_root_for_style, prevent_default } from 'svelte/internal';
	import StartPage from "./StartPage.svelte"

	let productName = ""
	let description = ""
	let errorArr = []
	let productCreated = false

	async function createProduct(){

		const product = {
			productName,
			description
		}

		try {
			const response = await fetch("http://localhost:8080/users", {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify(product)
			})

			switch(response.status){
				case 201:
					productCreated = true
					break

				case 400:
					errorArr = await response.json()
					errorArr = errorArr
					break
			}
		}catch(error){
			errorArr.push("COMMUNICATION_ERROR")
		}
	}

</script>

<Router>
	<main>
		<div>Create Product</div>

		{#if productCreated}
			<p>Product created!</p>
			<Link to="/">Go to startPage</Link>
		{:else}
			<form on:submit|preventDefault={createProduct}>
				<div>
					Product Name:
					<input type="text" name="" id="" bind:value={productName}>
				</div>

				<div>
					Product Description:
					<input type="text" name="" id="" bind:value={description}>
				</div>
				<input type="submit" value="Create Product">
			</form>

			{#if errorArr.length > 0}
				<p>Errors detected!</p>
				<ul>
					{#each errorArr as error}
						<li>{error}</li>
					{/each}
				</ul>
			{/if}
		{/if}
		<Route path="/StartPage" component="{StartPage}"></Route>
	</main>
</Router>