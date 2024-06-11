<script>
  import { getCookie } from '$lib/cookie'
  import Tl from './tl.svelte';

  const token = getCookie('token')
  const isLoggedIn = token != null
</script>

{#if isLoggedIn}
  <Tl />
{:else}
  <h1>Tankas</h1>
  <div id='login_or_signup'>
    <div>
      <h1>Log in</h1>
      <button></button>
    </div>
    <div>
      <h1>Sign up</h1>
      <button></button>
    </div>
  </div>
{/if}

<style>
  #login_or_signup {
    display: flex;
  }
</style>

