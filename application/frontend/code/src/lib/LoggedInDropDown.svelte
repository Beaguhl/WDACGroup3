<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.3.0/css/all.min.css">

<script>
	import {fly} from 'svelte/transition'
	let activeMenu = 'main'
	let menuHeight = 0
	let menuEl = null
	$: menuHeight = menuEl?.offsetHeight ?? 0
	
	
    import {Router, Link, Route} from 'svelte-routing'
    import Following from './Following.svelte';
    import MyWishList from './MyWishList.svelte';
    import Followers from './Followers.svelte';
    import CreateUser from './CreateUser.svelte';
    import { user } from '../user-store';
    let username = ""
    let password = ""
    let body = null
    let accessToken = null
    let noMatch = false
    let closedDropDown = true
    async function login(){
        console.log("clicked login")
        try {
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
                        accessToken: body.access_token
                    }
                    closedDropDown = false
                    break
                case 400:
                    noMatch = true
                    console.log("case 400")
                    break
            }
        } catch (error){
        }
    }
    
    
</script>
{#if closedDropDown}
    <div class="dropdown stack" style="height: {menuHeight}px">
	{#if activeMenu === 'main'} <!-- ska senare vara if logged in -->
    <div class="menu" in:fly={{ x: -300 }} out:fly={{ x: -300 }} bind:this={menuEl}>
        <Router>
            <main>
                {#if $user.isLoggedIn}
                    <div class="row">
                        <Link class="Links" to="/MyWishList" id="users-link" style="color: white; padding: 12px 16px; text-decoration: none; display: block;"><i class="fa-solid fa-gift item"></i>My WishList</Link>
                    </div>
                    <div class="row">
                        <Link class="Links" to="/Following" id="users-link" style="color: white; padding: 12px 16px; text-decoration: none; display: block;"><i class="fa-solid fa-star item"></i>Following</Link>
                    </div>
                    <div class="row">
                        <Link class="Links" to="/Followers" id="users-link" style="color: white; padding: 12px 16px; text-decoration: none; display: block;"><i class="fa-solid fa-user-group item"></i>My Followers</Link>
                    </div>
                {:else}
                    <form on:submit|preventDefault={login}>
                        <div class="form-group">
                            <label class="form-label" for="username">Username:</label>
                            <input class="form-input" type="text" id="username" name="username" bind:value={username}>
                        </div>
                        <div class="form-group">
                            <label class="form-label" for="password">Password:</label>
                            <input class="form-input" type="password" id="password" name="password" bind:value={password}>
                        </div>
                        <button class="form-btn" type="submit">Login</button>
                    </form>
                    <Link class="Links create-account-link" to="/create-account" style="font-size: small; color: #fff;">Don't have an Account? Create account.</Link>
                    {#if noMatch}
                        <p>The username and password does not match</p>
                    {/if}
                {/if}
                <Route path="/create-account" component="{CreateUser}"></Route>
                    <Route path="/Following" component="{Following}"></Route>
                    <Route path="/MyWishLish" component="{MyWishList}"></Route>
                    <Route path="/Followers" component="{Followers}"></Route>
            </main>
        </Router>
    </div>
		
	{/if}
	
</div>
{/if}
<style>
    .item {
        font-size: large;
        margin-right: 2vw;
    }
    .menu {
        font-size: large;
        width: 100%;
    }
    .row {
        padding: 5px;
    }
    .row:hover {
        background-color: rgb(55, 55, 55);
        padding: 5px;
    }
	.dropdown {
		position: absolute;
		top: 125px;
		width: 300px;
		transform: translateX(-45%);
		background-color: var(--bg);
		border: var(--border);
		border-radius: var(--border-radius);
		padding: 0.5rem;
		overflow: hidden;
		transition: height var(--speed) ease;
		z-index: 3;
	}
	
	.stack {
		display: grid;
		align-items: start; /* allow to shrink */
	}
	
	.stack > :global(*) {
		grid-area: 1 / 1;
	}
   
    .form {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 10px;
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
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 7px;
  cursor: pointer;
  width: 300px;
  font-size: 14px;
}
.create-account-link {
  display: block;
  text-align: center;
  font-weight: bold;
  margin-top: 20px;
  color: #4CAF50;
  text-decoration: none;
  font-size: 14px;
}
	
</style>