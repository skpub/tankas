<script>
  import { getCookie } from '$lib/cookie'
  import { goto } from '$app/navigation'
  import Tl from './tl.svelte';

  const token = getCookie('token')
  const isLoggedIn = token != null
</script>


{#if isLoggedIn}
  <div id='tl_slot'></div>
  <hr>
  <slot />
{:else}
  <div id='ichigen_san'>
    <h1>Tankas</h1>
    <div id='login_or_signup'>
      <div>
        <button on:click={() => goto('/login')}>Log in</button>
      </div>
      <div>
        <button on:click={() => goto('/signup')}>Sign up</button>
      </div>
    </div>
  </div>
{/if}

<style>
  #ichigen_san {
    width: 100px;
    margin: 0 auto;
    h1 {
      text-align: center;
    }
  }
  button {
    width: 100%;
  }
  #tl_slot {
    display: flex;
    flex-flow: column;
    width: 80%;
    height: 50px;
  }
</style>