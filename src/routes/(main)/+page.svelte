<script lang="ts">
  import { loggedIn } from '$lib/cookie'
  import Local_TL from './local_tl.svelte';
  import Global_TL from './global_tl.svelte';
  import { onMount } from 'svelte';
  import { selectionSlot } from './selectionSlot';
  // onMount(() => {
  //   console.log($loggedIn)
  // })
</script>

{#if $selectionSlot === 0}
  <Local_TL />
{:else if $selectionSlot === 1}
  <Global_TL />
{/if}

<style>
</style>

