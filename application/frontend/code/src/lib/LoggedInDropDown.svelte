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
    


   
</script>

<div class="dropdown stack" style="height: {menuHeight}px">
	{#if activeMenu === 'main'} <!-- ska senare vara if logged in -->
    <div class="menu" in:fly={{ x: -300 }} out:fly={{ x: -300 }} bind:this={menuEl}>
        <Router>
            <div class="row">
                <Link class="Links" to="/Following"><i class="fa-solid fa-star item"></i>Following</Link>
            </div>
            <div class="row">
                <Link class="Links" to="/MyWishList"><i class="fa-solid fa-gift item"></i> My WishList</Link>
            </div>
            <div class="row">
                <Link class="Links" to="/Followers"><i class="fa-solid fa-user-group item"></i>My Followers</Link>
            </div>
            
            <main>
                <Route path="/Following" component="{Following}"></Route>
                <Route path="/MyWishLish" component="{MyWishList}"></Route>
                <Route path="/Followers" component="{Followers}"></Route>
            </main>
        </Router>
        
        
        
    </div>
		
	{/if}

	
</div>



<style>

    .item {
        font-size: large;
        margin-right: 4vw;
    }

    .menu {
        font-size: large;
        width: 100%;
    }

    .row {
        padding: 10px;
    }

    .row:hover {
        background-color: rgb(55, 55, 55);
        padding: 10px;
    }

	.dropdown {
		position: absolute;
		top: 125px;
		width: 300px;
		transform: translateX(-45%);
		background-color: var(--bg);
		border: var(--border);
		border-radius: var(--border-radius);
		padding: 1rem;
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
	

</style>
