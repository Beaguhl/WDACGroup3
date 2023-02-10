<script>

	class Product{
		constructor(id, productName){
			this.id = id
			this.productName = productName
		}
	}

	let arrayOfProducts = []

	arrayOfProducts.push(new Product(1, "Product 1"))
	arrayOfProducts.push(new Product(2, "Product 2"))
	arrayOfProducts.push(new Product(3, "Product 3"))
	arrayOfProducts.push(new Product(4, "Product 4"))
	arrayOfProducts.push(new Product(5, "Product 5"))
	arrayOfProducts.push(new Product(6, "Product 6"))
	arrayOfProducts.push(new Product(7, "Product 7"))
	arrayOfProducts.push(new Product(8, "Product 8"))
	arrayOfProducts.push(new Product(9, "Product 9"))
	arrayOfProducts.push(new Product(9, "Product 10"))
	arrayOfProducts.push(new Product(9, "Product 11"))
	arrayOfProducts.push(new Product(9, "Product 12"))
</script>


<div>

	<h1>
		PlaceHolder
	</h1>

	<div class="squareContainer">
		{#each arrayOfProducts as product}
			<div class="square">
				<h1 class="test">
					{product.productName}
				</h1>
			</div>
		{/each}
	</div>
</div>

<style>

	.squareContainer{
		display: grid;
		height: 70vh;
		width: 100vw;
		grid-template-areas: 
		"topLeft topMidLeft topMidRight topRight"
		"midLeft midMidLeft midMidRight midRight"
		"botLeft botMidLeft botMidRight botRight";
		grid-template-rows: 10fr 10fr 10fr 1fr;
		grid-template-columns: 1fr 1fr 1fr 1fr;
		grid-gap: 5%;
		float: left;
	}

	.test{
		z-index: 1;
	}

	.square{
		width: 85%;
		height: 100%;
		border-radius: 20px;
		z-index: 2;
		box-shadow: 5px 5px 5px 2px;
		margin-bottom: 5%;
		margin-left: 6%;
		margin-right: 2%;
	}
	
</style>