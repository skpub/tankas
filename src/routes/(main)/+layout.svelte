<script lang="ts">
  import { getCookie } from '$lib/cookie'
  import { goto } from '$app/navigation'
  import { PUBLIC_API_ORIGIN } from "$env/static/public"
  import { onMount } from 'svelte'
  import type { Tanka } from './tankaReceive';
  import { tanka_msg } from './tankaReceive'

  const token = getCookie('token')
  const user_id = getCookie('user_id')
  const isLoggedIn = token != null

  let tanka = ''
  let poet = ''

  let socket: WebSocket
  onMount(() => {
    socket = new WebSocket(PUBLIC_API_ORIGIN + '/socket?user_id=' + user_id)

    socket.onopen = () => {
      console.log("connected.")
    }
    socket.onmessage = (event) => {
      // let data = JSON.parse(event.data)
      const instruction = event.data[0]
      const jsonData = event.data.slice(2)
      switch (instruction) {
        case '1': {
          const tanka: Tanka = JSON.parse(jsonData)
          tanka_msg.set(tanka)
          break
        }
        case '0': {
          console.log()
        }
      }
    }
  })

  function send1() {
    console.log("token:" + token)
    socket.send("1,"+token+`,{"meigen": "${tanka}", "poet": "${poet}"}`)
  }
</script>

{#if isLoggedIn}
  <div id='tl_container'>
    <div id='tl_slot'></div>
    <hr>
    <div id='tl_view' class='scroll'>
      <slot />
    </div>
    <form id='tanka_poster' action="">
      <textarea name="" id="" bind:value={tanka} placeholder="短歌を入力してください"></textarea>
      <input type="text" bind:value={poet} placeholder="詠んだ人の名前">
      <button on:click={send1}>投稿</button>
    </form>
  </div>
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
  #tl_container {
    margin: 0 auto;
    width: 80%;
    height: 100dvh;
    display: flex;
    flex-flow: column;
  }
  #tl_view {
    flex-grow: 1;
  }
  #tanka_poster {
    display: flex;
    flex-flow: row;
    margin: 0 auto;
    width: 80%;
    textarea {
      flex-grow: 1;
      padding: 20px;
    }
    button {
      margin: 20px;
      width: 100px;
    }
  }
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