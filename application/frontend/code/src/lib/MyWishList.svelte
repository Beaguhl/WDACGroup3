<script>

	import {Router, Link, Route} from 'svelte-routing'

	import { user } from "../user-store";
	let wishListProducts = []

	let listIsEmpty = true

	async function loadWishList(){
		try {
			const response = await fetch("http://localhost:8080/my-wishlist", {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
          			"Authorization": "bearer "+$user.accessToken,
          			"UserID": $user.userID
				}
			})

			switch(response.status) {
        
        		case 200:
          			wishListProducts = await response.json()
					listIsEmpty = false
					console.log(wishListProducts)
          			break
        
        		case 500:
          			break

				case 404:
					break

      		}

		} catch(error){
			// handle error
		}
	}

	loadWishList()

	async function searchProducts(event){
		const formData = new FormData(event.target);
		const searchString = formData.get('q');

		try {
			const response = await fetch("http://localhost:8080/my-wishlist/search?q=" + searchString, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					"Authorization": "bearer "+$user.accessToken,
					"UserID": $user.userID
				}
			})
			
		} catch(error){

		}
	}

</script>

<body>
	<section>
		<div class="container">
			<div class="squareContainer">
				
					
						<div class="container">
						<h1>My Wish List</h1>
							<form on:submit|preventDefault={searchProducts}>
								<div class="search-container">
									<input type="text" name="q" placeholder="Search for wish products...">
									<button type="submit" id="search-button">Search</button>
									<button type="button" id="show-all-button" on:click={loadWishList}>Show All Wish Products</button>
								</div>
							</form>
							<div class="search-container"></div>
						<div class="user-container">

							
									
										
											{#each wishListProducts as product}
													<h3>{product.productName}</h3>
											{/each}
										
									
								
						</div>
					</div>
					
					
				
			</div>
		</div>
	</section>
</body>

<style>

* {
	box-sizing: border-box;
	margin: 0;
	padding: 0;
}

.container {
	max-width: 960px;
	margin: 0 auto;
	padding: 20px;
}

h1 {
	text-align: center;
	margin-bottom: 20px;
	color: rgb(212, 247, 213);
}

h3 {
	color: white;
}

h3:hover {
	color: rgb(143, 249, 205);
	text-decoration: underline;
}

.search-container {
	display: flex;
	align-items: center;
	margin-bottom: 20px;
}

.search-container input[type="text"] {
	flex: 1;
	padding: 10px;
	border: none;
	border-bottom: 2px solid #ccc;
}

.search-container button {
	margin-left: 10px;
	padding: 10px;
	border: none;
	background-color: #333;
	color: #fff;
	cursor: pointer;
}

.search-container button:hover {
	background-color: #555;
}

.user-container {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
	grid-gap: 20px;
}

p {
	color: white
}
</style>