<script lang="ts">
  import { getCookie, loggedIn } from '$lib/cookie'
  import { goto } from '$app/navigation'
  import { PUBLIC_API_ORIGIN } from "$env/static/public"
  import { onMount } from 'svelte'
  import type { Tanka } from './tankaReceive'
  import { tanka_msg } from './tankaReceive'
  import { selectionSlot } from './selectionSlot'

  const token = getCookie('token')
  const user_id = getCookie('user_id')

  let tanka = ''
  let poet = ''

  let socket: WebSocket
  onMount(() => {
    socket = new WebSocket(PUBLIC_API_ORIGIN + `/socket?user_id=${user_id}&state=0`)

    socket.onopen = () => {
      console.log("socket connected.")
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
    socket.send("1,"+token+`,{"meigen": "${tanka}", "poet": "${poet}"}`)
  }
  function send0(index: number) {
    selectionSlot.set(index)
    socket.send("0,"+token+`,{"state": ${index}}`)
  }

  const tlSlot = ['local', 'global']
</script>

{#if $loggedIn}
  <div id='tl_container'>
    <div id='tl_slot'>
      {#each tlSlot as slot, index}
        <h2
          class='slot'
          class:selected={$selectionSlot === index}
          on:click={() => send0(index)}
        >{slot}</h2>
      {/each}
    </div>
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
  .slot.selected {
    color: var(--color1) !important;
  }
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
    flex-flow: row;
    width: 80%;
    height: 50px;
    h2 {
      margin-right: 24px;
      color: grey;
    }
    h2:hover {
      opacity: 0.8;
    }
  }
</style>