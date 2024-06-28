<script lang="ts">
  import { goto } from "$app/navigation";
  import { PUBLIC_API_ORIGIN } from "$env/static/public";
  import { getCookie } from "$lib/cookie";
  import { notify } from "$lib/notificationStore";
  import { onDestroy, onMount } from "svelte";
  import type { Tanka } from "./tankaReceive";
  import { tanka_msg } from "./tankaReceive";

  let tl_fetcher: number
  onMount(() => {
    tl_fetch()
  })

  onDestroy(() => {
    clearInterval(tl_fetcher)
  })

  let contents: Tanka[] = []

  $: {
    if ($tanka_msg) {
      console.log($tanka_msg)
      contents = [...contents, $tanka_msg]
    }
  }

  async function tl_fetch() {
    contents = []
    const token = getCookie('token')
    if (token != null) {
      const res = await fetch(PUBLIC_API_ORIGIN + `/auth/fetch_tl?before=${Date.now()+1}`, {
        method: 'GET',
        headers: {
          Authorization: `${token}`
        },
        // body: JSON.stringify({
        //   before: time
        // }),
      })
      res.json().then(data => {
        const ret_contents: Tanka[] = data.contents
        if (ret_contents.length === 0) return
        console.log(ret_contents)
        for (let content of ret_contents) {
          contents.push(content)
          contents = contents
        }
      })
    } else {
      notify('トークンが期限を迎えました。')
      goto('/login')
    }
  }
  const timeoptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short'
  }
</script>

<div id='TL'>
  {#each contents as content}
    <div class='tanka_container'>
      <p class='whom'>{content.whom_id}</p>
      <p class='tanka'>「 {content.meigen} 」</p>
      <i><p class='poet'>{content.poet}</p></i>
      <p class='time'>{(() => {
        const date = new Date(content.created_at.Time)
        const yyyymmdd = new Intl.DateTimeFormat(
          'ja-JP',
          {
            year:   'numeric',
            month:  '2-digit',
            day:    '2-digit',
            hour:   '2-digit',
            minute: '2-digit',
            second: '2-digit',
          }
        )
        return yyyymmdd.format(date)
      })()}</p>
    </div>
    <hr>
  {/each}
</div>

<style>
  #TL_container {
    display: flex;
    flex-flow: column;
    height: calc(100dvh - 100px);
  }
  #TL {
    width: 100%;
    flex-grow: 1;
    margin: 0 auto;
    background-color: var(--background-contents);
  }
  .tanka_container {
    font-family: sans-serif;
    padding: 15px;
    padding-left: 32px;
  }
  .time {
    opacity: 0.5;
    color: var(--color1)
  }
  .tanka {
    font-size: 18px;
    filter: drop-shadow(3px 3px 0px #000000);
  }
  .whom {
    margin: 0;
    color: var(--color2)
  }
  .poet {
    margin: 0;
  }
</style>
