
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.3.0/css/all.min.css">

<script>

	import { user } from "../user-store"

	export let id
	let isFetchingProduct = true
	let failedToFetchProduct = false
	let fetchedProduct = null

	async function loadProduct(){
		console.log("inside loadProduct")
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
					console.log("fetched product: " + fetchedProduct)
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

	loadProduct()

	

	//arrayOfProductInfo.push(new ProductInformation("Horse", 500, "It's a unicorn"))

 // document.addEventListener ("DOMContentLoaded", function() {

	// ------------------- following button, som laggar -------------
	//var follow = false
	/*document.getElementById("follow").addEventListener("click", ToggleFollow)
	
	function ToggleFollow() {
	  
	  var followOrNot = document.getElementById("follow")
	  
	  if (follow){
		followOrNot.innerHTML = "Following ✔️"
		follow = false
	  } else {
		followOrNot.innerHTML = "✚ Follow"
		follow = true
	  }

	}*/
  
 // })


 /* export let location

  console.log("haha")

  console.log(location)

  const product = location.state*/

</script>

<!------------ HTML code ----------->



<!-- alla färger är bara tillfälliga för att det ska vara enkelt att se vad som är vad, dom ska ändras sen -->


	{#if $user.isLoggedIn}

		{#if isFetchingProduct}
			<p>Wait, fetching data...</p>
		{:else if failedToFetchProduct}
			<p>Couldn't fetch product. Check your Internet connection.</p>
		{:else if fetchedProduct}
		<div class="flex">
			<div class="card">
				<h1 class="card-title">
					{fetchedProduct.productName}
				</h1>
				<h2 class="card-subtitle">
					{fetchedProduct.description}
				</h2>
				<button class="card-button">
					Add to WishList
				</button>
			</div>
		</div>
		{/if}
	{/if}



<style>
	

	.flex{
		display: flex;
		justify-content: center;
	}

	.card {
		margin-top: 150px;
		border-radius: 5px;
		text-align: center;
		width: 600px;
	}

	.card-title {
		font-size: 120px;
		font-weight: bold;
		margin-bottom: 10px;
	}

	.card-subtitle {
		font-size: 40zpx;
		color: #888888;
		margin-bottom: 20px;
	}

	.card-button {
		background-color: #4CAF50;
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
