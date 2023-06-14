<script>
	import { user } from "../user-store";

	export let id;
	let isFetchingUser = true;
	let failedToFetchUser = false;
	let fetchedUser = null;
	let fetchedFollow = null;
	let resourceForbidden = false;
	let wishListProducts = [];
	let errors = []

	async function loadUsersWishList() {
		try {
			const response = await fetch("http://localhost:8080/wishlist/" + id, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: "bearer " + $user.accessToken,
				},
			});

			switch (response.status) {
				case 200:
					wishListProducts = await response.json();
			}
		} catch (error) {
			errors = [errors, error]
			console.log(error);
		}
	}

	async function loadUser() {
		try {
			const response = await fetch("http://localhost:8080/users/" + id, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: "bearer " + $user.accessToken,
				},
			});

			switch (response.status) {
				case 200:
					const { userToSend, followToSend } = await response.json();

					id = userToSend.userID;
					await loadUsersWishList();
					fetchedUser = userToSend;

					fetchedFollow = followToSend;

					isFetchingUser = false;
					break;

				case 404:
					isFetchingUser = false;

				case 403:
					resourceForbidden = true;
					break;
			}
		} catch (error) {
			errors = [errors, error]
			console.log(error);
		}
	}

	loadUser();

	async function followUser() {
		try {
			const response = await fetch("http://localhost:8080/followings", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: "bearer " + $user.accessToken,
				},
				body: JSON.stringify({ id }),
			});

			switch (response.status) {
				case 201:
					loadUser();
					break;

				case 404:
			}
		} catch (error) {
			errors = [errors, error]
			console.log(error);
		}
	}

	let unableToUnfollow = false;

	async function unfollowUser() {
		try {
			const response = await fetch("http://localhost:8080/followings", {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					Authorization: "bearer " + $user.accessToken,
				},
				body: JSON.stringify({ id }),
			});

			switch (response.status) {
				case 204:
					loadUser();
					break;

				case 500:
					unableToUnfollow = true;
					break;
			}
		} catch (error) {
			errors = [errors, error]
			console.log(error);
		}
	}

	async function purchaseProduct(wishListProductID) {
		try {
			const response = await fetch(
				"http://localhost:8080/wishlist-product/" + wishListProductID + "/purchase",
				{
					method: "PATCH",
					headers: {
						"Content-Type": "application/json",
						Authorization: "bearer " + $user.accessToken,
					},
				}
			);

			switch (response.status) {
				case 200:
					loadUser();
			}
		} catch (error) {
			errors = [errors, error]
			console.log(error);
		}
	}

	async function undoPurchaseProduct(wishListProductID) {
		try {
			const response = await fetch(
				"http://localhost:8080/wishlist-product/" + wishListProductID + "/undo-purchase",
				{
					method: "PATCH",
					headers: {
						"Content-Type": "application/json",
						Authorization: "bearer " + $user.accessToken,
					},
				}
			);

			switch (response.status) {
				case 200:
					loadUser();

				case 403:
			}
		} catch (error) {
			errors = [errors, error]
			console.log(error);
		}
	}
</script>

<link
	rel="stylesheet"
	href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.3.0/css/all.min.css"
/>
<body>
	{#if $user.isLoggedIn}
		{#if resourceForbidden}
			<p>You can not view yourself</p>
		{:else if isFetchingUser}
			<p>Wait, fetching data...</p>
		{:else if failedToFetchUser}
			<p>Couldn't fetch user. Check your Internet connection.</p>
		{:else if fetchedUser}
			<title />

			<div id="profile">
				<h1>{fetchedUser.username}</h1>
				{#if fetchedFollow != null}
					<button class="follow-button following" on:click={unfollowUser}
						>Following</button
					>
				{:else}
					<button class="follow-button" on:click={followUser}>Follow</button>
				{/if}

				{#if unableToUnfollow}
					<p>Unable to unfollow user</p>
				{/if}

				<div class="wish-list">
					{#if wishListProducts.length != 0}
						{#each wishListProducts as product}
							{#if product[1].purchased}
								<div class="wish-item done">
									<div class="wish-title">{product[0].productName}</div>
									<button
										on:click={() =>
											undoPurchaseProduct(product[1].wishListProductID)}
									>
										<div class="done-checkbox done">✓</div>
									</button>
								</div>
							{:else}
								<div class="wish-item">
									<div class="wish-title">{product[0].productName}</div>
									<button
										on:click={() =>
											purchaseProduct(product[1].wishListProductID)}
									>
										<div class="done-checkbox" />
									</button>
								</div>
							{/if}
						{/each}
					{:else}
						<p>User no not have any wishlist products</p>
					{/if}
					{#if errors.length > 0}
						<p>Errors detected!</p>
						<ul>
							{#each errors as error}
								<li>{error}</li>
							{/each}
						</ul>
					{/if}
				</div>
			</div>
		{:else}
			<p>Did not find any user with the given id</p>
		{/if}
	{:else}
		<p>Can not show user if not logged in to an account</p>
	{/if}
</body>

<style>
	p {
		color: white;
	}

	body {
		font-family: Arial, sans-serif;
	}
	#profile {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin: 50px auto;
		width: 80%;
		max-width: 800px;
	}
	h1 {
		font-size: 36px;
		margin-bottom: 10px;
		color: white;
		padding: 10px 30px 30px 30px;
	}
	.follow-button {
		padding: 10px 30px;
		border-radius: 20px;
		background-color: #00bfff;
		color: white;
		font-size: 18px;
		cursor: pointer;
		transition: background-color 0.3s ease;
	}
	.follow-button:hover {
		background-color: #1e90ff;
	}
	.follow-button.following {
		background-color: #808080;
	}
	.wish-list {
		overflow-y: scroll;
		max-height: 400px;
		margin-top: 20px;
	}

	button {
		background-color: transparent;
		border: none;
		padding: 0;
	}

	button .done-checkbox {
		display: inline-block;
		width: 20px; /* set a fixed width for the checkbox */
		height: 20px; /* set a fixed height for the checkbox */
		color: white; /* set the text color of the checkbox */
		font-size: 16px; /* set the font size of the checkbox */
		text-align: center; /* center the text in the checkbox */
		line-height: 20px; /* set the line height to match the height of the checkbox */
	}

	/* hide the text "done" */
	button .done-checkbox.done::after {
		content: "";
		display: none;
	}

	.wish-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		border: 1px solid #ccc;
		padding: 10px;
		margin-bottom: 10px;
	}
	.wish-item.done {
		background-color: #5c995c;
	}
	.wish-item .wish-title {
		flex-grow: 1;
		margin-right: 10px;
		font-weight: bold;
		cursor: pointer;
		color: white;
	}

	.wish-item .done-checkbox {
		height: 20px;
		width: 20px;
		border-radius: 50%;
		border: 1px solid #ccc;
		display: flex;
		justify-content: center;
		align-items: center;
		cursor: pointer;
		transition: background-color 0.3s ease;
	}
	.wish-item .done-checkbox.done {
		background-color: #2b423a;
		color: white;
		border-color: #ffffff;
	}

	:global(body) {
		background-color: rgb(255, 255, 255);
		justify-content: center;
		flex-direction: column;
	}

</style>
