<script>
    import {Router, Link, Route, navigate} from 'svelte-routing'
    import { get_root_for_style, prevent_default } from 'svelte/internal';
    import StartPage from "./StartPage.svelte"
    import { user } from '../user-store';


    let username = ""
    let password = ""
    let errorArr = []
    let userWasCreated = false


    //let username = ""
    //let password = ""
    let body = null
    let accessToken = null
    let noMatch = false
    let closedDropDown = false
    async function login(){
        try {
            console.log("now we login after creating account")
            console.log("Userud is" + $user.userID)
            const response = await fetch("http://localhost:8080/tokens", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: `grant_type=password&username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
            })
            switch(response.status){
                case 200:
                    body = await response.json()
                    //accessToken = body.access_token
                    console.log("nu kommer logged in token: " + body.access_token)
                    
                    $user = {
                        isLoggedIn: true,
                        accessToken: body.access_token,
                        userID: body.userID,
                        admin: body.admin
                    }
                    closedDropDown = true
                    navigate("/")

                    break
                    
                case 400:
                    noMatch = true
                    console.log("case 400")
                    break
            }
        } catch (error){
            console.log(error)
        }
    }

    async function createUser(){

        const user = {
                username,
                password
        }

        // add loading
        try {
            const response = await fetch("http://localhost:8080/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(user)
            })

            console.log("response status is: " + response.status)
            switch(response.status){
                case 201:
                    //created user
                    login()
                    break

                case 400:
                    console.log("found error!")
                    errorArr = await response.json()
                    errorArr = errorArr
                    break
            }
        } catch (error) {
            errorArr.push("COMMUNICATION_ERROR")
        }
        
    }

</script>

<Router>
	<main>
        <div>Create Account</div>
            
        
            <form on:submit|preventDefault={createUser}>
                <div>
                    Username:
                    <input type="text" name="" id="" bind:value={username}>
                </div>

                <div>
                    Password:
                    <input type="text" name="" id="" bind:value={password}>
                </div>

                <input type="submit" value="Create Account">
            </form>

            {#if errorArr.length > 0}
                <p>Errors detected!</p>
                <ul>
                    {#each errorArr as error}
                        <li>{error}</li>
                    {/each}
                </ul>
            {/if}

        
        
		<Route path="/StartPage" component="{StartPage}"></Route>
	</main>
</Router>