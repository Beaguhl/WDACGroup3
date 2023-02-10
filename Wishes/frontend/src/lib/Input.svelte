<script>
    export let inputUsername = ""
    export let inputPassword = ""
</script>
<form>
    <input type="text" placeholder="Username" autocomplete="off" id="loginInput" bind:value={inputUsername} on:input>
    <input type="text" placeholder="Password" autocomplete="off" id="loginInput" bind:value={inputPassword} on:input>
    <button class="loginButton">Login</button>
</form>

<style>
    /* The search field */
    #loginInput {
      box-sizing: border-box;
      font-size: 1.2rem;
      padding: 14px 20px 12px 45px;
      border: none;
      border-bottom: 1px solid #ddd;
    }

    #loginInput:focus {
        outline: 3px solid #ddd;
    }

    .loginButton{
        float: right;
    }	
</style>
