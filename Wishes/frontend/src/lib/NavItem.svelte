<script>
    let open = false
</script>

<li class="nav-item">
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div on:click|preventDefault={() => open = !open}>
        <slot name="trigger" />
    </div>
    {#if open}
        <slot />
    {/if}
</li>

<style>
    .nav-item{
        width: calc(var(--nav-size) * 1);
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>