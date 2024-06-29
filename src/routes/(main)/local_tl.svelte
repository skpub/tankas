<script lang="ts">
  import { goto } from "$app/navigation";
  import { PUBLIC_API_ORIGIN } from "$env/static/public";
  import { getCookie } from "$lib/cookie";
  import { notify } from "$lib/notificationStore";
  import { onDestroy, onMount } from "svelte";
  import type { Tanka } from "./tankaReceive";
  import Quote from "./quote.svelte"
  import { fetchUserImgCache } from "../userImageCache";

  let tl_fetcher: number
  onMount(() => {
    tl_fetch()
  })

  onDestroy(() => {
    clearInterval(tl_fetcher)
  })

  const token = getCookie('token')

  let contents: Tanka[] = []

  let wait: Promise<any>

  async function tl_fetch() {
    contents = []
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
        const user_ids: Set<string> = new Set()
        const ret_contents: Tanka[] = data.contents
        if (ret_contents.length === 0) return
        for (let content of ret_contents) {
          user_ids.add(content.whom_id)
          contents.push(content)
          contents = [...contents, content]
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

<div id='TL'>
  {#each contents as tanka}
  <Quote  {tanka} {wait}/>
  {/each}
</div>

<style>
  #TL {
    width: 100%;
    flex-grow: 1;
    margin: 0 auto;
    background-color: var(--background-contents);
  }
</style>
