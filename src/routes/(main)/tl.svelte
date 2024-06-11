<script>
    import { PUBLIC_API_ORIGIN } from "$env/static/public";
    import { getCookie } from "$lib/cookie";
    import { notify } from "$lib/notificationStore";

  const contents = ['value', 'value2']

  async function tl_fetch() {
    const token = getCookie('token')
    if (token != null) {
      const res = await fetch(PUBLIC_API_ORIGIN + '/auth/fetch_tl', {
        method: 'GET',
        headers: {
          'Authentication': token
        }
      })
      res.json().then(data => {
        console.log(data)
      })
    } else {
      notify('トークンが期限を迎えました。')
    }
  }
</script>

<div id='TL'>
  {#each contents as content}
    <div class='tanka'>{content}</div>
  {/each}
  <button on:click={() => tl_fetch()}></button>
</div>

<style>
  #TL {
    width: 80%;
    margin: 0 auto;
    background-color: var(--background-contents);
  }
  .tanka {
    padding: 15px;
  }
</style>