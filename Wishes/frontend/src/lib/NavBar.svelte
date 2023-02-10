<nav class="navbar" style="{$$props.style}">
    <ul class="navbar-nav">
        <slot/>
    </ul>
</nav>

<style>
    .navbar{
        height: 100%;
        background-color: var(--bg);
        padding: 0 1rem;
        border-bottom: var(--border);
    }

    ul{
        list-style: none;
        margin: 0;
        padding: 0;
    }

    .navbar-nav{
        max-width: 100%;
        height: 100%;
        display: flex;
        justify-content: flex-end;
    }

</style>