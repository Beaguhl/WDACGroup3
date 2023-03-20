
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

				case 403:
					resourceForbidden = true
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
			<title></title>

			<div>
				<h1>{fetchedProduct.productName}</h1>
			</div>
		{/if}
	{/if}



<style>

	.test{
		display: flex;
		align-items: flex-end;
		justify-content: center;
	}

	.mainGrid{
		display: grid;
		grid-template-columns: 2fr 2fr;
		border-radius: 10px;
	}

	.leftColumn{
		text-align: center;
		margin-left: 50px;
		margin-top: 10%;
	}

	.title{
		text-align: center;
		font-size: 30px;
		font-weight: 600;
		letter-spacing: 1px;
		/*margin: 30px 0;*/
	}

	.leftColumn {
		text-align: center;
		max-width: 450px;
	}

	:global(body) {
		justify-content: center;
		flex-direction: column;
	}

	.wishList {
		padding: 18px;
		box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
		border-radius: 5px;
		background-color: blanchedalmond;
	}

	#profilePic{
		max-width: 100%;
		max-height: 100%;
		width: 350px;  
		height: auto; 
		object-fit: cover;
		margin-top: 80px;
		border-radius: 10px; 
	}
	
	.item-btn{
	justify-content: space-between;
	align-items: center;
	gap: 10px;
	cursor: pointer;
  }

	.item-btn i {
	font-size: 18px;
  }
</style>
