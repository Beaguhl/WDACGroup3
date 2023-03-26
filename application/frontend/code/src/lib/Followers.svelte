<script>
	import { Router, Link, Route } from "svelte-routing";
	import { user } from "../user-store";
	import User from "./User.svelte";

	let isFetchingFollowers = true;
	let isUnAuthorized = false;
	let followers = [];
	let isServerError = false;
	let searchedFollowers = [];
	let startedSearch = false;
	let isFetchingSearchedFollowers = true;
	let showAllFollowers = true;
	let noSearchFound = false;

	async function loadAllFollowers() {
		showAllFollowers = true;
		try {
			const response = await fetch("http://localhost:8080/followers", {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: "bearer " + $user.accessToken,
					UserID: $user.userID,
				},
			});

			switch (response.status) {
				case 200:
					followers = await response.json();
					isFetchingFollowers = false;
					break;

				case 401:
					isUnAuthorized = true;
					isFetchingFollowers = false;
					break;

				case 500:
					isServerError = true;
					break;

				case 404:
					isFetchingFollowers = false;
					break;
			}
		} catch (error) {
			console.log(error);
		}
	}

	loadAllFollowers();

	async function searchFollowers(event) {
		showAllFollowers = false;
		startedSearch = true;
		const formData = new FormData(event.target);
		const searchString = formData.get("q");

		try {
			const response = await fetch(
				"http://localhost:8080/followers/search?q=" + searchString,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Authorization: "bearer " + $user.accessToken,
						UserID: $user.userID,
					},
				}
			);

			switch (response.status) {
				case 200:
					searchedFollowers = await response.json();
					noSearchFound = false;
					isFetchingSearchedFollowers = false;
					break;

				case 404:
					noSearchFound = true;
					isFetchingSearchedFollowers = false;
					break;
			}
		} catch (error) {
			console.log(error);
		}
	}
</script>

{#if $user.isLoggedIn}
	<Router>
		<section>
			<div class="container">
				<div class="squareContainer">
					<div class="container">
						<h1>My followers</h1>
						<form on:submit|preventDefault={searchFollowers}>
							<div class="search-container">
								<input type="text" name="q" placeholder="Search for followers..." />
								<button type="submit" id="search-button">Search</button>
								<button
									type="button"
									id="show-all-button"
									on:click={loadAllFollowers}>Show All Followers</button
								>
							</div>
						</form>
						<div class="search-container" />
						<div class="user-container">
							{#if !showAllFollowers}
								{#if startedSearch}
									{#if isFetchingSearchedFollowers}
										<p>searching...</p>
									{:else if noSearchFound}
										<p>No followers found</p>
									{:else if searchedFollowers.length != 0}
										{#each searchedFollowers as searchedUser}
											<Link class="Links" to="/users/{searchedUser.userID}">
												<h3>{searchedUser.username}</h3>
											</Link>
										{/each}
									{:else}
										<p>You do not have any followers</p>
									{/if}
								{/if}
							{:else}
								{#if isFetchingFollowers}
									<p>Wait, I'm loading</p>
								{:else if isUnAuthorized}
									<p>Need to be logged in to view users.</p>
								{:else if isServerError}
									<p>Website has server errors. Try again later</p>
								{/if}
								{#if followers.length != 0}
									{#each followers as searchedUseri}
										<Link class="Links" to="/users/{searchedUseri.userID}">
											<h3>{searchedUseri.username}</h3>
										</Link>
									{/each}
								{:else}
									<p>You do not have any followers</p>
								{/if}
							{/if}
						</div>
					</div>
				</div>
			</div>
		</section>

		<main>
			<Route path="/user" component={User} />
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
		color: white;
	}
</style>
