<script lang="ts">
	export let num: number;
	export let state: boolean;
</script>

{#if state == true}
	<button class="w-full h-full bg-green-500 text-white rounded-lg">
		{num}
	</button>
{/if}
{#if state == false}
	<button class="w-full h-full"></button>
{/if}
