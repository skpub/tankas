<script lang="ts">
  import { goto } from "$app/navigation";
  import { PUBLIC_API_ORIGIN } from "$env/static/public";
  import { getCookie } from "$lib/cookie";
  import { notify } from "$lib/notificationStore";
  import { onDestroy, onMount } from "svelte";

  let tl_fetcher: number
  onMount(() => {
    tl_fetch()
  })

  onDestroy(() => {
    clearInterval(tl_fetcher)
  })

  type Meigen = {
    Meigen: string,
    WhomID: string,
    Name: string,
  }
  let contents: Meigen[] = [{Meigen: 'デバッグ用名言', WhomID: '山本さん', Name: '誰かさん'}]

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
        const ret_contents: Meigen[] = data.contents
        if (ret_contents.length === 0) return
        console.log(ret_contents)
        for (let content of ret_contents) {
          const tmp: Meigen = {
            Meigen: content.Meigen,
            WhomID: content.WhomID,
            Name: content.Name
          }
          contents.push(tmp)
          contents = contents
        }
      })
    } else {
      notify('トークンが期限を迎えました。')
      goto('/login')
    }
  }
</script>

<div id='TL'>
  {#each contents as content}
    <div class='tanka_container'>
      <p class='whom'>{content.WhomID}</p>
      <p class='tanka'>「 {content.Meigen} 」</p>
      <i><p class='poet'>{content.Name}</p></i>
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