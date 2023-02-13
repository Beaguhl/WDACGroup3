

<script>
	import {Router, Link, Route} from 'svelte-routing'
	import SpecificUser from "./SpecificUser.svelte";
	import {onMount} from 'svelte'

  import { get, writable } from 'svelte/store';

let show = writable(false);

	let users;

	async function getData() {
    const response = await fetch('../../dummyData.json');
    const data = await response.json();
    users = data;
	}

	onMount(getData);

  async function funcToRun () {
    await getData()
    const userItem = document.getElementById("userItem");
    console.log("now it should work: " + userItem.innerHTML);
  }

  onMount(() => {
    getData();
    funcToRun();
  });
  

</script>
  
<body>

  <div>search users</div>

  

  
  <!----------- search bar ---------->
<div class="search" id="fan">
	<input id="search" type="text" placeholder="Search..">
</div>

	<section>
		<div class="container" id="hej">
			<div class="squareContainer">
				{#if users}
					{#each users as user}
						<div class="column is-4-tablet is-3-desktop square">
							<section class="container" id="userItem">
                <Router>
                  <Link class="Links" to="/SpecificUser">
                    <div class="profilePicture" id="profilePicture">
                      <img class="imageSize" src="{user.image}" alt="">
                    </div> 
                    <div class="text">
                      {user.username}
                    </div>
                  </Link> 
                	<main>
                    <Route path="/SpecificUser" component="{SpecificUser}"></Route>
                  </main>
                </Router>
							</section>   
						</div> 
					{/each}
				{/if}
			</div>
		</div>
	</section>


</body>

	

<style>

	.imageSize{
		width: 10vw;
		height: 20vh;
    border-radius: 10px;
	}

	.profilePicture{
	  margin-top: 10%;
	  display: flex;
	  justify-content: center;
	}

	.container{
	  grid-template-rows: 1fr 1fr;
	  color: black;
	}

	.container :hover {
	  color: rgb(151, 28, 172);
	}

	.text{
	  display: flex;
	  justify-content: center;
	  margin-top: 4%;
	  font-size: x-large;
	  font-weight: bolder;
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

	#search {
	  padding: 6px;
	  border: none;
	  margin: 3%;
	  font-size: 17px;
	  background-color: blue;
	  border-radius: 10px;
	}

	.search {
	  text-align: center;
	}

</style>