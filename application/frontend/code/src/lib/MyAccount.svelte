<script>
    import { user } from "../user-store";
    import {Router, Link, Route} from 'svelte-routing';

    let showAccount = true
    let showEnterPassword = false
    let incorrectPassword = null
    let showEditAccount = false
    let username = null
    let userNotFound = false

    let newUsername = username
    let newPassword = ""

    function makeShowEnterPasswordTrue(){
        showEnterPassword = true
        showAccount = false
    }

    console.log("user är: " + $user.userID)

    async function getUsername(){
        try {
            const response = await fetch("http://localhost:8080/my-account", {
                method: "GET",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Authorization": "bearer "+$user.accessToken,
                    "UserID": $user.userID
                }
            })

            switch (response.status){
                case 200:
                    username = await response.json()
                    break
                
                case 404:
                    userNotFound = true
                    break

                case 500:
                    console.log("500 error")
                    break
            }
            

        } catch {
            //handle error
        }
    }

    getUsername();

    let body = null
    let noMatch = false


    async function verifyPassword(event){
        const formData = new FormData(event.target);
		const enteredPassword = formData.get('password');
        console.log("Entered password is: " + enteredPassword)
        console.log(user)

        try {
            const response = await fetch("http://localhost:8080/tokens", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: `grant_type=password&username=${encodeURIComponent(username)}&password=${encodeURIComponent(enteredPassword.toString())}`
            })
            switch(response.status){
                case 200:
                    showEditAccount = true
                    showEnterPassword = false
                    showAccount = false
                    break

                case 403:
                    incorrectPassword = true
                    break

                case 400:
                    console.log("not matcing password")
                    noMatch = true
                    console.log("case 400")
                    break
            }
        } catch (error){
        }
    }

</script>

<head>
    <title>My Account</title>
</head>

{#if $user.isLoggedIn}
    {#if userNotFound}
        <p>user not found</p>
    {:else}
        <body>
            <div class="container">
                <h1>My Account</h1>
                {#if showAccount}
                    <form on:submit|preventDefault={makeShowEnterPasswordTrue}>
                        <div class="form-group">
                            <label for="username">Username:</label>
                            <div class="underline-textfield">
                                <input type="text" id="username" name="username" value="{username}">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="password">Current password:</label>
                            <div class="underline-textfield">
                                <input type="password" id="password" name="password" value="xxxxxxxxxxx">
                            </div>
                        </div>
                        <div class="form-group">
                            <input type="submit" value="Edit account details">
                        </div>
                    </form>
                {/if}
                {#if showEnterPassword}
                    <form on:submit|preventDefault={verifyPassword}>
                        <div class="form-group">
                            <label for="password">Type current password to make changes:</label>
                            <div class="underline-textfield">
                                <input type="password" id="password" name="password">
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <input type="submit" value="OK">
                        </div>

                        {#if incorrectPassword}
                            <p>Incorrect password, try again.</p>
                        {/if}
                    </form>
                {/if}

                {#if showEditAccount == true}
                        <form action="">
                            <div class="form-group">
                                <label for="username">New username:</label>
                                <div class="underline-textfield">
                                    <input type="text" id="username" name="username" bind:value={newUsername}>
                                </div>
                                <div class="form-group">
                                    <input type="submit" value="Update username">
                                </div>
                            </div>
                        </form>
                    
                        <form>
                            <div class="form-group">
                                <label for="password">New password:</label>
                                <div class="underline-textfield">
                                    <input type="password" id="password" name="password">
                                </div>
                                <div class="form-group">
                                    <input type="submit" value="Update password">
                                </div> 
                            </div>
                        </form>
                {/if}
            </div>
        </body>
    {/if}
    
{:else}
    <p>Need to be logged in to view "My Account"</p>
{/if}


<style>

.container {
	margin: 50px auto;
	padding: 30px;
	border-radius: 10px;
	box-shadow: 0 0 10px rgba(0,0,0,0.1);
	width: 600px;
}

p {
    color: white;
}

h1 {
	font-size: 36px;
	margin-bottom: 20px;
	text-align: center;
    color: rgb(212, 247, 213);
}

form {
	margin-top: 30px;
}

.form-group {
	margin-bottom: 20px;
	display: flex;
	flex-direction: column;
}

label {
	display: block;
	margin-bottom: 10px;
	font-size: 24px;
	color: white;
    margin-right: 100px;
}

.underline-textfield {
	position: relative;
	margin-bottom: 20px;
}

.underline-textfield input[type="text"],
.underline-textfield input[type="password"] {
	padding: 10px;
	font-size: 24px;
	border: none;
	background: none;
	outline: none;
	color: white;
}

.underline-textfield::after {
	content: "";
	position: absolute;
	bottom: 0;
	left: 0;
	height: 2px;
	width: 100%;
	background-color: rgb(212, 247, 213);
}

.lined-up {
  display: flex;
  align-items: center;
}

input[type="submit"] {
	background-color: #276047;
	border: none;
	border-radius: 5px;
	padding: 10px;
	font-size: 24px;
	cursor: pointer;
	margin-left: 10px;
	color: white;
    margin-left: 10px;
}

input[type="submit"]:first-child {
	margin-left: auto;
}

input{
    color: rgb(255, 255, 255);
}
</style>