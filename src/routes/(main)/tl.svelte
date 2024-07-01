<script lang="ts">
  import { goto } from "$app/navigation";
  import { PUBLIC_API_ORIGIN } from "$env/static/public";
  import { getCookie } from "$lib/cookie";
  import { notify } from "$lib/notificationStore";
  import { onDestroy, onMount } from "svelte";
  import { tanka_msg, type Tanka } from "./tankaReceive";
  import Quote from "./quote.svelte"
  import { fetchUserImgCache } from "../userImageCache";
  import { selectionSlot } from "./selectionSlot";

  let tl_fetcher: number
  let tl: HTMLDivElement
  let isRunning = false
  let token = getCookie('token')
  onMount(() => {
    tl.addEventListener('scroll', () => {
      if (!isRunning) {
        window.requestAnimationFrame(async () => {
          if (tl.scrollTop + tl.clientHeight >= tl.scrollHeight && contents.length > 0) {
            const time = new Date(contents[contents.length-1].created_at.Time).getTime() / 1000
            const _ = await tl_fetch($selectionSlot, Math.ceil(time), false)
          } else {
            const _ = await tl_fetch($selectionSlot, Math.ceil(Date.now()/1000), false)
          }
          isRunning = false
        })
      }
    })
    tl_fetch($selectionSlot, Date.now(), true)
  })

  onDestroy(() => {
    clearInterval(tl_fetcher)
  })


  let contents: Tanka[] = []

  tanka_msg.subscribe((tanka) => {
    if (tanka !== undefined) {
      contents = [tanka, ...contents]
    }
  })

  let wait: Promise<any>
  
  $: tl_fetch($selectionSlot, Date.now(), true)

  async function tl_fetch(selection: number, before: number, init: boolean) {
    if (init) {
      contents = []
    }
    if (token != null) {
      var res
      switch (selection) {
        case 0: {
          res = await fetch(PUBLIC_API_ORIGIN + `/auth/fetch_tl?before=${before}`, {
            method: 'GET',
            headers: {
              Authorization: `${token}`
            },
          })
        }
        break
        default: {
          res = await fetch(PUBLIC_API_ORIGIN + `/auth/fetch_global_tl?before=${before}`, {
            method: 'GET',
            headers: {
              Authorization: `${token}`
            },
          })
        }
      }
      res.json().then(data => {
        const user_ids: Set<string> = new Set()
        const ret_contents: Tanka[] = data.contents
        if (ret_contents.length === 0) return
        for (let content of ret_contents) {
          if (contents.length === 0) {
            user_ids.add(content.whom_id)
            contents = [...contents, content]
          }
          else if (contents[contents.length - 1].created_at.Time > content.created_at.Time) {
            user_ids.add(content.whom_id)
            contents = [...contents, content]
          }
        }
        wait = fetchUserImgCache(user_ids, token)
      })
    } else {
      notify('トークンが期限を迎えました。')
      goto('/login')
    }
  }
  async function fetch_user_image(user_id: string) {
    const img = await fetch(PUBLIC_API_ORIGIN + `/auth/fetch_user_imgs?user_id=${user_id}`, {
      method: 'GET',
      headers: {
        Authorization: `${token}`
      },
    })
    return await img.blob()
  }

</script>

<div id='TL' class='scroll' bind:this={tl}>
  {#each contents as tanka}
  <Quote  {tanka} {wait}/>
  {/each}
</div>

<style>
  #TL {
    height: 100%;
    width: 100%;
    flex-grow: 1;
    margin: 0 auto;
    background-color: var(--background-contents);
  }
</style>
