<script lang="ts">
  import { loggedIn } from '$lib/cookie'
  import Local_TL from './local_tl.svelte';
  import { onMount } from 'svelte';
  onMount(() => {
    console.log($loggedIn)
  })
</script>

{#if $loggedIn}
  <Local_TL />
{:else}
  <div id='login_or_signup'>
  <h1>Tankas</h1>
    <div>
      <button>Log in</button>
    </div>
    <div>
      <button>Sign up</button>
    </div>
  </div>
{/if}

<style>
  #login_or_signup {
    align-items: center;
    margin: 0 auto;
    display: flex;
    flex-flow: column;
    button {
      widtH: 100px;
    }
  }
</style>

