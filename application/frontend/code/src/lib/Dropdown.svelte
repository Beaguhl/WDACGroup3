<script>
    import { Router, Route, Link, navigate } from "svelte-routing";
	import { onMount } from "svelte";

    import jwt_decode from "jwt-decode";

    import { user } from "../user-store";
    import CreateUser from "../lib/CreateUser.svelte";


    let username = "";
	let password = "";
	let body = null;
	let noMatch = false;
	let closedDropDown = true;
	let emptyField = false;
    let dropdownShown = false;


    async function tryToLogin() {
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
					const jwtDecoded = jwt_decode(body.id_token);
					//@ts-ignore
					const userID = jwtDecoded.sub;

					$user = {
						isLoggedIn: true,
						accessToken: body.access_token,
						userID: userID,
						admin: body.admin,
					};
					closedDropDown = true;
					username = "";
					password = "";
					emptyField = false;
					dropdownShown = false;
					noMatch = false;
					break;

				case 400:
					noMatch = true;
					break;

				case 403:
					emptyField = false;
					noMatch = true;
					break;
			}
		} catch (error) {
			console.log(error);
		}

        
        
	}
    function toggleDropDown() {
            console.log("hej")
		    dropdownShown = !dropdownShown;
	    }


</script>
<Router>
    <div class="dropdown">
    <button class="dropbtn" on:click={toggleDropDown}>Login</button>
    {#if dropdownShown}
        <div class="dropdown-content">
                <main>
                    <form on:submit|preventDefault={tryToLogin}>
                        <div class="form-group">
                            <label class="form-label" for="username"
                                >Username:</label
                            >
                            <input
                                class="form-input"
                                type="text"
                                id="username"
                                name="username"
                                bind:value={username}
                            />
                        </div>
                        <div class="form-group">
                            <label class="form-label" for="password"
                                >Password:
                            </label>
                            <input
                                class="form-input"
                                type="password"
                                id="password"
                                name="password"
                                bind:value={password}
                            />
                        </div>
                        <button class="form-btn" id="pointer" type="submit"
                            >Login</button
                        >
                    </form>
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <div on:click|preventDefault={toggleDropDown}>
                        <Link
                            class="Links create-account-link"
                            to="/create-account"
                            style="font-size: small; color: #fff;"
                            >Don't have an Account? Create account.</Link
                        >
                    </div>
                    {#if emptyField}
                        <p class="error-message">No field can be left empty</p>
                    {/if}
                    {#if noMatch}
                        <p class="error-message">
                            Username and password is not a match
                        </p>
                    {/if}
                    <Route path="/create-account" component={CreateUser} />
                </main>
        </div>
    {/if}
</div>
</Router>

<style>
    .form-label {
		font-weight: bold;
		margin-bottom: 5px;
		font-size: 14px;
	}

	#pointer {
		cursor: pointer;
	}
	.dropdown {
		position: relative;
		display: inline-block;
	}

	.dropdown-content {
		position: absolute;
		z-index: 1;
		left: -240px;
		background-color: #333;
		padding: 20px;

	}

	.dropbtn {
		color: white;
		background-color: transparent;
		border: none;
		font-size: 16px;
		cursor: pointer;
	}

	.dropbtn:hover {
		text-decoration: underline;
	}

	.form-group {
		display: flex;
		flex-direction: column;
		margin-bottom: 5px;
	}

	.form-label {
		font-weight: bold;
		margin-bottom: 5px;
		font-size: 14px;
	}

	.form-input {
		padding: 3px;
		border: 1px solid #ccc;
		border-radius: 5px;
		width: 290px;
		font-size: 14px;
	}

	.form-btn {
		background-color: #4caf50;
		color: white;
		border: none;
		border-radius: 5px;
		padding: 7px;
		cursor: pointer;
		width: 300px;
		font-size: 14px;
	}

	.error-message {
		margin-top: 5px;
		color: red;
		font-size: 14px;
	}
</style>