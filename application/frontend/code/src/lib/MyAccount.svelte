<script>
    import { user } from "../user-store";
    import {Router, Link, Route, navigate} from 'svelte-routing';
    import { each } from "svelte/internal";


    let showAccount = true
    let showEnterPasswordForEdit = false
    let showEnterPasswordForDelete = false
    let incorrectPassword = null
    let showEditAccount = false
    let username = null
    let userNotFound = false
    let showDeleteAccount = false

    let newUsername = ""
    let newPassword = ""

    let succesfulUsernameUpdate = false
    let succesfulPasswordUpdate = false

    let successfulDelete = false

    let passwordErrors = []
    let usernameErrors = []

    function makeShowEnterPasswordForEditTrue(){
        showEnterPasswordForEdit = true
        showAccount = false
    }

    function makeShowEnterPasswordForDeleteTrue(){
        showEnterPasswordForDelete = true
        showAccount = false
    }

    function logout(){
        $user.isLoggedIn = false
        navigate("/")
    }


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
                    break
            }
            

        } catch {
            //handle error
        }
    }

    getUsername();

    let body = null
    let noMatch = false


    async function verifyPasswordForEdit(event){
        const formData = new FormData(event.target);
		const enteredPassword = formData.get('password');

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
                    showEnterPasswordForEdit = false
                    showAccount = false
                    break

                case 403:
                    incorrectPassword = true
                    break

                case 400:
                    noMatch = true
                    break
            }
        } catch (error){
            // handle error
        }
    }

    async function verifyPasswordForDelete(event){
        const formData = new FormData(event.target);
		const enteredPassword = formData.get('password');

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
                    showDeleteAccount = true
                    showEnterPasswordForDelete = false
                    showAccount = false
                    break

                case 403:
                    incorrectPassword = true
                    break

                case 400:
                    noMatch = true
                    break
            }
        } catch (error){
            // handle error
        }
    }

    async function updatePassword(){
        try {
            const response = await fetch("http://localhost:8080/my-account/update-password", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "bearer "+$user.accessToken,
                    "UserID": $user.userID,
                    "NewPassword": newPassword
                }
            
            })

            switch(response.status){
                case 200:
                    succesfulPasswordUpdate = true
                    passwordErrors = []
                    break

                case 500:
                    break

                case 400:
                    passwordErrors = await response.json()
                    break
            }
            
        } catch (error) {
            // handle error
        }

    }

    async function updateUsername(){
        try {
            const response = await fetch("http://localhost:8080/my-account/update-username", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "bearer "+$user.accessToken,
                    "UserID": $user.userID,
                    "NewUsername": newUsername
                }
            })

            switch(response.status){
                case 200:
                    succesfulUsernameUpdate = true
                    usernameErrors = []
                    break

                case 500:
                    break

                case 400:
                    usernameErrors = await response.json()
                    break
            }

        } catch (error){
            // handle error
        }
    }

    async function deleteUser(){
        try{
            const response = await fetch("http://localhost:8080/my-account/delete-account", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "bearer "+$user.accessToken,
                    "UserID": $user.userID
                },
                body: JSON.stringify({})
            })
            switch(response.status){
                case 200:
                    logout()
                    successfulDelete = true

                case 500:
                    break

                case 400:
                    break
            }
        }catch(error){

        }
    }



    /**
	 * @param {{ preventDefault: () => void; }} event
	 */
    async function handleDelete(event){
        event.preventDefault()

        try{
            await deleteUser()
        }catch(error){

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
                    <form on:submit|preventDefault={makeShowEnterPasswordForEditTrue}>
                        <div class="form-group">
                            <label for="username">Username:</label>
                            <div class="underline-textfield">
                                <input type="text" id="username" name="username" value="{username}" readonly>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="password">Current password:</label>
                            <div class="underline-textfield">
                                <input type="password" id="password" name="password" value="xxxxxxxx" readonly>
                            </div>
                        </div>
                        <div class="form-group">
                            <input type="submit" value="Edit account details">
                        </div>
                        
                    </form>
                    <form on:submit|preventDefault={makeShowEnterPasswordForDeleteTrue}>
                        <div class="form-group">
                            <input type="submit" value="Delete account">
                        </div>
                    </form>
                {/if}
                {#if showEnterPasswordForEdit}
                    <form on:submit|preventDefault={verifyPasswordForEdit}>
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

                {#if showEnterPasswordForDelete}
                    <form on:submit|preventDefault={verifyPasswordForDelete}>
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

                {#if showDeleteAccount}
                    <div>
                        <h1>Are you sure you want to delete your account: {username}</h1>
                        <p style="text-align: center;">This cannot be undone</p>
                        <Link class="Links" to="" id="null" style="color: white; text-decoration: none; margin-right: 40px;">
                            <button style="background-color: red;" on:click={handleDelete}>Yes</button>
                        </Link>
                        <Link class="Links" to="/">
                            <button style="background-color: #2A7BE6">No</button>
                        </Link>
                    </div>
                {/if}

                {#if showEditAccount == true}
                        <!-- update username -->
                        <form on:submit|preventDefault={updateUsername}>
                            <div class="form-group">
                                <label for="username">New username:</label>
                                <div class="underline-textfield">
                                    <input type="text" id="username" name="username" bind:value={newUsername}>
                                </div>

                                <ul>
                                    {#each usernameErrors as error}
                                        <li>{error}</li>
                                    {/each}
                                </ul>

                                {#if succesfulUsernameUpdate}
                                    <p>Username Updated</p>
                                {:else}
                                    <div class="form-group">
                                        <input type="submit" value="Update username">
                                    </div>
                                {/if}
                                
                            </div>
                        </form>
                    
                        <!-- update password -->
                        <form on:submit|preventDefault={updatePassword}>
                            <div class="form-group">
                                <label for="password">New password:</label>
                                <div class="underline-textfield">
                                    <input type="password" id="password" name="password" bind:value={newPassword}>
                                </div>
                                
                                <ul>
                                    {#each passwordErrors as error}
                                        <li>{error}</li>
                                    {/each}
                                </ul>

                                {#if succesfulPasswordUpdate == true}
                                    <p>Password Updated</p>
                                {:else}
                                    <div class="form-group">
                                        <input type="submit" value="Update password">
                                    </div> 
                                {/if}
                                
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