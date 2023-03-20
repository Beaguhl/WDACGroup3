<script>
    import {Router, Link, Route} from 'svelte-routing'
    import { get_root_for_style, prevent_default } from 'svelte/internal';
    import StartPage from "./StartPage.svelte"

    let username = ""
    let password = ""
    let errorArr = []
    let userWasCreated = false

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
                    userWasCreated = true
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
            
            {#if userWasCreated}
                <p>Account created!</p>
                <Link to="/">Go to start page</Link>
            {:else}
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

        {/if}
        
		<Route path="/StartPage" component="{StartPage}"></Route>
	</main>
</Router>