<script>
	import User from "./User.svelte";
	import { user } from "../user-store";
	
	import {Router, Link, Route} from 'svelte-routing';

	let isFetchingUsers = true
  	let isUnAuth = false
	let users = []
	let isServerError = false

	async function loadUsers () {
		try {
			const response = await fetch("http://localhost:8080/users", {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					"Authorization": "bearer "+$user.accessToken
				}
			})

			switch(response.status) {
				case 200:
					users = await response.json()
					isFetchingUsers = false
					break
				
				case 401:
					isUnAuth = true
					isFetchingUsers = false
					break

				case 500:
					isServerError = true
					break

			}
			
		} catch(error){

		}
	}

	loadUsers()

</script>

{#if $user.isLoggedIn}
	<div>
		find users
	</div>
	<!----------- search bar ---------->
	<div class="search">
		<input id="search" type="text" placeholder="Search..">
	</div>
	<Router>
		<section>
			
			<div class="container">
				<div class="squareContainer">
					{#if isFetchingUsers}
						<p>Wait, I'm loading</p>
					{:else if isUnAuth} 
						<p>Need to be logged in to view users.</p>
					{:else if isServerError}
						<p>Website has server errors. Try again later</p>
					{:else if users}
						<div class="list">  
							<ul>
								{#each users as searchedUser}
									<li>
										<section class="container" id="userItem">
											<Link class="Links" to="/user/{searchedUser.userID}">
												<div class="text">
													{searchedUser.username}
													{searchedUser.userID}
												</div>
											</Link> 
										</section>   
									</li>
								{/each}
							</ul>
						</div>
					{:else}
						<p>No users found</p>
					{/if}
				</div>
			</div>
		</section>

		<main>
			<Route path="/user" component="{User}"></Route>
		</main>
	</Router>
{:else}
	<p>You need to be logged in to an account to view users</p>
{/if}


  
  
  <style>
	/*#userItem {
	background-color: rgba(94, 127, 132, 0.418);
	padding-bottom: 30px;
	padding-left: 20px;
	padding-right: 20px;
	padding-top: 25px;
	border-radius: 25px;
  }*/

  .search {
	  text-align: center;
	}

  ul {
  margin: 0;
  padding: 0;
  list-style-type: none;
}

  p {
	color: white
  }
  
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
	  color: white;
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