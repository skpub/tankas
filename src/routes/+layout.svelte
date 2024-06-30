<script lang="ts">
  import { goto } from '$app/navigation';
  import icon from '$lib/img/icon.svg'
  import search from '$lib/img/search.svg'
  import profile from '$lib/img/profile.svg'
  import home from '$lib/img/home.svg'
  import Notification from '$lib/Notification.svelte'
  import { notify } from '$lib/notificationStore'
  import { loggedIn, getCookie, refreshTokenPeriodically } from '$lib/cookie'
  import { onMount } from 'svelte'
  // export { notify }
  const user_id = getCookie('user_id')
  onMount(() => {
    if ($loggedIn) {
      refreshTokenPeriodically()
    }
  })
</script>

<div id='main'>
  <div id='menu_container'>
    <img id='tankas_icon' src={icon} alt="">
    <div id='menu'>
      <a href="/">
        <img src={home} alt="">
      </a>
      <a href="/search">
        <img src={search} alt="">
      </a>
      {#if $loggedIn}
        <a href={`/user/${user_id}`}>
          <img src={profile} alt="">
        </a>
      {/if}
    </div>
  </div>
  <div id='content'>
    <slot />
  </div>
  <Notification />
</div>

<style>
  :global(body) {
    font-family: 'Zen Maru Gothic', sans-serif;
    --background: #252320;
    --background-contents: #353330;
    --foreground: #f5f5f5;
    --color1: #ffd790;
    --color2: #a0f7ff;
    --warning: #f04040;
    color: var(--foreground);
    background-color: var(--background);
    margin: 0;
    padding: 0;
  }
  :global(a) {
    text-decoration: none;
    color: inherit;
  }
  :global(a:hover) {
    opacity: 0.8;
  }
  :global(.scroll) {
    overflow: auto;
  }
  :global(h1) {
    font-family: Arial, Helvetica, sans-serif;
    font-size: 30px;
    font-weight: normal;
  }
  :global(form) {
    display: flex;
    flex-flow: column;
  }
  :global(input, textarea) {
    margin-bottom: 10px;
    background-color: var(--background);
    padding: 5px;
    color: var(--foreground);
    border: 2px solid #ffffff30;
    border-radius: 10px;
  }
  :global(input:focus, textarea:focus) {
    outline: 2px solid var(--color1);
  }
  :global(button) {
    margin-top: 20px;
    background-color: var(--color2);
    color: var(--background);
    height: 50px;
    width: 100px;
    border-radius: 30px;
  }
  #main {
    display: flex;
  }
  #menu_container {
    display: flex;
    flex-flow: column;
    width: 70px;
    height: 100dvh;
    /* background-color: rgb(from var(--color1) r g b); */
    background-color: var(--background-contents);
    a, img {
      margin: 0 auto;
    }
  }
  #tankas_icon {
    width: 60%;
    padding-bottom: 50px;
    filter: drop-shadow(1px 1px 0.5px var(--background));
    padding-top: 15px;
  }
  #menu {
    display: flex;
    flex-flow: column;
    a {
      padding: 10px;
      width: 40%;
    }
  }
  #content {
    flex-grow: 1;
    /* margin-left: 15px; */
    display: flex;
    align-items: center;
  }
</style>