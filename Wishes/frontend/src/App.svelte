
<script>
	import {Router, Link, Route} from 'svelte-routing'
	import StartPage from "./lib/StartPage.svelte"
</script>


<Router>
	<div class="mainDiv">
			<h1 class="wishes">
				<Link class="Links" to="/">Wishes</Link>
			</h1>
			<nav class="navBar">
				<Link class="Links" to="/FindWishes">Find Wishes</Link>
				<Link class="Links" to="/FindUsers">Find Users</Link>
				<Link class="Links" to="/Login">PlaceHolder</Link>
			</nav>
	</div>
	<div>
		<StartPage></StartPage>
	</div>
</Router>



<style>
	:global(body){
		margin: 0;
		padding: 0;
		height: 100vh;
		width: 100%;
	}

	.mainDiv{
		display: flex;
		width: 80vw;
		background-color: gray;
	}


	.navBar{
		margin-top: 4%;
		display: flex;
		justify-content: space-around;
		align-items: flex-start;
		width: 100%;
	}

	.wishes{
		display: flex;
		width: fit-content;
		float: left;
		margin-left: 5%;
	}

</style>

