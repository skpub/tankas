<script lang="ts">
  import { loggedIn } from '$lib/cookie'
  import TL from './tl.svelte';
  import { onMount } from 'svelte';
  import { selectionSlot } from './selectionSlot';
  // onMount(() => {
  //   console.log($loggedIn)
  // })
</script>

<TL />

<style>
</style>
