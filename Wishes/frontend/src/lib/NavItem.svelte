<script>
    let open = false
</script>

<li class="nav-item">
    <div on:click|preventDefault={() => open = !open}>
        <slot name="trigger" />
    </div>
    {#if open}
        <slot />
    {/if}
</li>

<style>
    .nav-item{
        width: calc(var(--nav-size) * 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>