<script>
    import {Router, Link, Route} from 'svelte-routing'
    import StartPage from "./StartPage.svelte"

</script>

<Router>
	<main>
        <form>
            <label for="username">Username:</label>
            <input type="text" id="username" name="username">
            <br>
            <label for="password">Password:</label>
            <input type="password" id="password" name="password">
            <br>
            <button type="submit">Create account</button>
          </form>

		<Route path="/StartPage" component="{StartPage}"></Route>
	</main>
</Router>