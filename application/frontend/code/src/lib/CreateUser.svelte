<script>
	import { Router, Link, Route, navigate } from "svelte-routing";
	import StartPage from "./StartPage.svelte";
	import { user } from "../user-store";

	let username = "";
	let password = "";
	let errorArr = [];

	let body = null;
	let noMatch = false;
	let closedDropDown = false;
	async function login() {
		try {
			const response = await fetch("http://localhost:8080/tokens", {
				method: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
				body: `grant_type=password&username=${encodeURIComponent(
					username
				)}&password=${encodeURIComponent(password)}`,
			});
			switch (response.status) {
				case 200:
					body = await response.json();

					$user = {
						isLoggedIn: true,
						accessToken: body.access_token,
						userID: body.userID,
						admin: body.admin,
					};
					closedDropDown = true;
					navigate("/");

					break;

				case 400:
					noMatch = true;
					break;
			}
		} catch (error) {
			console.log(error);
		}
	}

	async function createUser() {
		const user = {
			username,
			password,
		};

		// add loading
		try {
			const response = await fetch("http://localhost:8080/users", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(user),
			});

			switch (response.status) {
				case 201:
					login();
					break;

				case 400:
					errorArr = await response.json();
					errorArr = errorArr;
					break;
			}
		} catch (error) {
			console.log(error);
			errorArr.push("COMMUNICATION_ERROR");
		}
	}
</script>

<Router>
	<body>
		<h1>Create Account</h1>

		<form on:submit|preventDefault={createUser}>
			<div>
				<label for="username">Username:</label>
				<input type="text" name="username" id="username" bind:value={username} />
			</div>

			<div>
				<label for="password">Password:</label>
				<input type="password" name="password" id="password" bind:value={password} />
			</div>

			<input type="submit" value="Create Account" />
		</form>

		{#if errorArr.length > 0}
			<p>Errors detected!</p>
			<ul>
				{#each errorArr as error}
					<li>{error}</li>
				{/each}
			</ul>
		{/if}

		<Route path="/StartPage" component={StartPage} />
	</body>
</Router>

<style>
	h1,
	p {
		text-align: center;
	}
	h1 {
		color: rgb(255, 255, 255);
	}

	ul {
		text-align: center;
		color: rgb(255, 255, 255);
	}

	body {
		font-family: Arial, Helvetica, sans-serif;
		font-size: 16px;
	}

	h1 {
		font-size: 2rem;
		margin-bottom: 1rem;
	}

	form {
		max-width: 400px;
		margin: 0 auto;
	}

	label {
		display: block;
		margin-bottom: 0.5rem;
		color: rgb(255, 255, 255);
	}

	input[type="text"],
	input[type="password"] {
		width: 100%;
		padding: 0.5rem;
		margin-bottom: 1rem;
		border: 1px solid #ccc;
		border-radius: 4px;
		box-sizing: border-box;
	}

	input[type="submit"] {
		background-color: #4caf50;
		color: white;
		padding: 0.5rem 1rem;
		border: none;
		border-radius: 4px;
		cursor: pointer;
	}

	p {
		color: red;
		font-weight: bold;
	}

	ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	li {
		margin-bottom: 0.5rem;
	}
</style>
