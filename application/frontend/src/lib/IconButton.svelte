<script>
    import Icon from "./Icon.svelte"
    export let path = ""
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="icon-button" on:click|preventDefault>
    <Icon {path} />
</div>

<style>
    .icon-button {
		--button-size: calc(var(--nav-size) * 1);
		width: var(--button-size);
		height: var(--button-size);
		background-color: #484a4d;
		border-radius: 50%;
		padding: 5px;
		margin: 2px;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: filter 300ms;
		color: var(--text-color);
	}

	.icon-button:hover{
		filter: brightness(1.2)
	}

</style>