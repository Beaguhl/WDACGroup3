<script>
	import {Router, Link, Route} from 'svelte-routing'
	import { user } from "../user-store";
	import User from './User.svelte';
	
	let isFetchingFollowings = true
  	let isUnAuth = false
	let followings = []
	let isServerError = false
	let searchedFollowings = []
	let startedSearch = false
	let isFetchingSearchedFollowings = true
	let showAllFollowings = true
	let noSearchFound = false

	console.log("userID: " + $user.userID)
	console.log("token: " + $user.accessToken)

	async function loadAllFollowings () {
		console.log("load all followings")
		showAllFollowings = true
		try {
			console.log("try to response")
			const response = await fetch("http://localhost:8080/follows/followings", {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					"Authorization": "bearer "+$user.accessToken,
					"UserID": $user.userID
				}
			})

			switch(response.status) {
				case 200:
          			followings = await response.json()
					isFetchingFollowings = false
					break
				
				case 401:
					isUnAuth = true
					isFetchingFollowings = false
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

	loadAllFollowings()

	async function searchFollowings(event){
		console.log("search followings")
		showAllFollowings = false
		startedSearch = true
		const formData = new FormData(event.target);
		const searchString = formData.get('q');

		try {
			const response = await fetch("http://localhost:8080/follows/followings/search?q=" + searchString, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					"Authorization": "bearer "+$user.accessToken,
					"UserID": $user.userID
				}
			})

			switch(response.status) {
				case 200:
					searchedFollowings = await response.json()
					console.log("searched users are: " + searchedFollowings)
					noSearchFound = false
					isFetchingSearchedFollowings = false
					break
				
				case 404:
					isFetchingSearchedFollowings = false
					noSearchFound = true
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
						<h1>Followings</h1>
							<form on:submit|preventDefault={searchFollowings}>
								<div class="search-container">
								<input type="text" name="q" placeholder="Search for users...">
								<button type="submit" id="search-button">Search</button>
								<button type="button" id="show-all-button" on:click={loadAllFollowings}>Show All Users</button>
								</div>
							</form>
							<div class="search-container"></div>
						<div class="user-container">

							{#if !showAllFollowings}
								{#if startedSearch}
									{#if isFetchingSearchedFollowings}
										<p>searching...</p>
									{:else}
									
										{#if noSearchFound}
											<p>User not found</p>
										{:else}
											{#each searchedFollowings as searchedUser}
												<Link class="Links" to="/users/{searchedUser.userID}">
													<h3>{searchedUser.username}</h3>
												</Link> 
											{/each}
										{/if}
									{/if}
								{/if}
							{:else}
								{#if isFetchingFollowings}
									<p>Wait, I'm loading</p>
								{:else if isUnAuth} 
									<p>Need to be logged in to view users.</p>
								{:else if isServerError}
									<p>Website has server errors. Try again later</p>
								{/if}
								{#each followings as searchedUseri}
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
<p>You need to be logged in to an account to view following</p>
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