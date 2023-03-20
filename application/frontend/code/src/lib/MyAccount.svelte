<script>
    import { user } from "../user-store";
    import {Router, Link, Route} from 'svelte-routing';

    let showAccount = true
    let showEnterPassword = false
    let wrongPassword = null
    let showEditAccount = false
    let userInfo = null

    function makeShowEnterPasswordTrue(){
        showEnterPassword = true
        showAccount = false
    }

    async function verifyPassword(){
        const formData = new FormData(event.target);
		const enteredPassword = formData.get('password');
        console.log("Entered password is: " + enteredPassword)
        console.log(user)

        try {
            const response = await fetch("http://localhost:8080/my-account", {
                method: "GET",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Authorization": "bearer "+$user.accessToken,
                    "Password": enteredPassword
                }
            })

            

            switch (await response.status){
                case 200:
                    showAccount = false
                    showEnterPassword = false
                    showEditAccount = true
                    break

                case 403:
                    showAccount = false
                    showEnterPassword = true
                    wrongPassword = true
                    break

                case 401:
                    break
                
            }

        } catch {
            //handle error
        }
    }

</script>

<head>
    <title>My Account</title>
</head>
<body>
    <div class="container">
		<h1>My Account</h1>
        {#if showAccount}
        <p>${userInfo}</p>
            <form on:submit|preventDefault={makeShowEnterPasswordTrue}>
                <div class="form-group">
                    <label for="username">Username:</label>
                    <div class="underline-textfield">
                        <input type="text" id="username" name="username" value="dde">
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

                {#if wrongPassword}
                    <p>Incorrect password, try again.</p>
                {/if}
            </form>
        {/if}

        {#if showEditAccount == true}
            <form action="">
                <div class="form-group">
                    <label for="username">New username:</label>
                    <div class="underline-textfield">
                        <input type="text" id="username" name="username" value="ddeded">
                    </div>
                </div>

                <div class="form-group">
                    <label for="password">New password:</label>
                    <div class="underline-textfield">
                        <input type="password" id="password" name="password">
                    </div>
                </div>
            
                <div class="form-group">
                    <input type="submit" value="Save updates">
                </div>
            </form>
        {/if}
		

        
        
       
	</div>
</body>

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
}

label {
	display: block;
	margin-bottom: 10px;
	font-size: 24px;
    color: white;
}

.underline-textfield {
	position: relative;
	margin-bottom: 20px;
}

.underline-textfield input[type="text"], .underline-textfield input[type="password"] {
	padding: 10px;
	width: 100%;
	font-size: 24px;
	border: none;
	background: none;
	outline: none;
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
	float: right;
}

input{
    color: rgb(255, 255, 255);
}
</style>