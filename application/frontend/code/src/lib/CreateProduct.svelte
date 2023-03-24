<script>
	import {Router, Link, Route} from 'svelte-routing'
	import { user } from '../user-store'
	import StartPage from "./StartPage.svelte"
	

	let productName = ""
	let description = ""
	let errorArr = []
	let productCreated = false
	let somethingWentWrong = false

	async function createProduct(){

		const product = {
			productName,
			description
		}

		try {
			const response = await fetch("http://localhost:8080/products", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Authorization": "bearer "+$user.accessToken
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

		} catch(error) {
			somethingWentWrong = true
			console.log(error)
			errorArr.push("COMMUNICATION_ERROR")
		}
	}

</script>

<Router>
	<body>
		
	
	<main>
		<h1>Create Product</h1>

		{#if somethingWentWrong }
			<p>Something went wrong.</p>
		{:else}
			<form on:submit|preventDefault={createProduct}>
				<div>
					<label for="productName">Product Name:</label>
					<input type="text" name="" id="" bind:value={productName}>
				</div>

				<div>
					<label for="description">Product Description:</label>
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
		{/if}
		
	</main>
</body>
</Router>

<style>
	 h1, p {
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

    input[type="text"]{
        width: 100%;
        padding: 0.5rem;
        margin-bottom: 1rem;
        border: 1px solid #ccc;
        border-radius: 4px;
        box-sizing: border-box;
    }

    input[type="submit"] {
        background-color: #4CAF50;
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