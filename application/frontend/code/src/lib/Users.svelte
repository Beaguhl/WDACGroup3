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

					<div class="container">
						<h1>Find users</h1>
						<div class="search-container">
							<input type="text" placeholder="Search for users...">
							<button id="search-button">Search</button>
							<button id="show-all-button">Show All</button>
						</div>
						<div class="user-container">
							{#each users as searchedUser}
							<Link class="Links" to="/user/{searchedUser.userID}">
								<h3>{searchedUser.username}</h3>
							</Link> 
							{/each}
						</div>
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