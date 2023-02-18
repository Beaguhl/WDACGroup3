<script>

	import {Router, Link, Route} from 'svelte-routing'
	import SpecificProduct from "./SpecificProduct.svelte";
	import {onMount} from 'svelte'

	let users;

	async function getData() {
	const response = await fetch('../../dummyData.json');
	const data = await response.json();
	users = data;
	}

	
	onMount(getData);
	console.log("nu kommer users" + users)
</script>

<Router>
	<section>
		<div class="container">
			<div class="squareContainer">
				<div>
                    my wishlist
                </div>
				{#if users}
					{#each users as product}
						<div class="column is-4-tablet is-3-desktop square">
							<section class="container" id="userItem">
								<Link class="Links" to="/SpecificUser">
									<div class="profilePicture">
										<img class="imageSize" src="{product.image}" alt="">
									</div> 
									<div class="text">
										{product.username}
									</div>
								</Link> 
							</section>   
						</div> 
					{/each}
				{/if}
			</div>
		</div>
	</section>
	<main>
		<Route path="/SpecificProduct" component="{SpecificProduct}"></Route>
	</main>
</Router>

<style>

	.imageSize{
		width: 10vw;
		height: 20vh;
	}

	.container{
	  grid-template-rows: 1fr 1fr;
	  color: black;
	}

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

	.profilePicture{
	  margin-top: 10%;
	  display: flex;
	  justify-content: center;
	}

	.text{
	  display: flex;
	  justify-content: center;
	  margin-top: 4%;
	  font-size: x-large;
	  font-weight: bolder;
	  color: black;
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
		background-color: rgba(94, 127, 132, 0.418);
	}
	
</style>