<script>
	import User from "./User.svelte";
	import { user } from "../user-store";
	
	import {Router, Link, Route} from 'svelte-routing';

	let isFetchingUsers = true
  	let isUnAuthorized = false
	let users = []
	let isServerError = false
	let searchedUsers = []
	let startedSearch = false
	let isFetchingSearchedUsers = true
	let showAllUsers = null
	let noSearchResults = false


	async function loadAllUsers () {
		showAllUsers = true
		try {
			const response = await fetch("http://localhost:8080/users", {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					"Authorization": "bearer "+$user.accessToken,
					"UserID": $user.userID
				}
			})

			switch(response.status) {
				case 200:
					users = await response.json()
					isFetchingUsers = false
					break
				
				case 401:
					isUnAuthorized = true
					isFetchingUsers = false
					break

				case 500:
					isServerError = true
					break

				case 404:
					break

			}
			
		} catch(error){

		}
	}

	loadAllUsers()

	async function searchUsers(event){
		showAllUsers = false
		startedSearch = true
		const formData = new FormData(event.target);
		const searchString = formData.get('q');

		try {
			const response = await fetch("http://localhost:8080/users/search?q=" + searchString, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					"Authorization": "bearer "+$user.accessToken,
					"UserID": $user.userID
				}
			})

			switch(response.status) {
				case 200:
					noSearchResults = false
					searchedUsers = await response.json()
					isFetchingSearchedUsers = false
					break
				
				case 404:
					isFetchingSearchedUsers = false
					noSearchResults = true
					break

			}
			
		} catch(error){

		}
	}

</script>

{#if $user.isLoggedIn}

	<Router>
		<section>
			<div class="container">
				<div class="squareContainer">
					

						<div class="container">
							<h1>Find users</h1>
								<form on:submit|preventDefault={searchUsers}>
									<div class="search-container">
										<input type="text" name="q" placeholder="Search for users...">
										<button type="submit" id="search-button">Search</button>
										<button type="button" id="show-all-button" on:click={loadAllUsers}>Show All Users</button>
									</div>
								</form>
								<div class="search-container"></div>
							<div class="user-container">

								{#if showAllUsers == false}
									{#if startedSearch}
										{#if isFetchingSearchedUsers}
											<p>searching...</p>
										{:else}
										
											{#if noSearchResults}
												<p>No search results found</p>
											{:else}
												{#each searchedUsers as searchedUser}
													<Link class="Links" to="/users/{searchedUser.userID}">
														<h3>{searchedUser.username}</h3>
													</Link> 
												{/each}
											{/if}
										{/if}
									{/if}
								{:else if showAllUsers == true}
									{#if isFetchingUsers}
										<p>Wait, I'm loading</p>
									{:else if isUnAuthorized} 
										<p>Need to be logged in to view users.</p>
									{:else if isServerError}
										<p>Website has server errors. Try again later</p>
									{/if}
									{#each users as searchedUseri}
										<Link class="Links" to="/users/{searchedUseri.userID}">
											<h3>{searchedUseri.username}</h3>
										</Link> 
									{/each}
								{/if}
							</div>
						</div>
					
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