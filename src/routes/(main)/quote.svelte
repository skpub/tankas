<script lang="ts">
  import { onMount } from "svelte";
  import type { Tanka } from "./tankaReceive";
  import default_icon from "$lib/img/default_icon.png";
  import { userImageCache } from "../userImageCache";
    import { goto } from "$app/navigation";

  export let tanka: Tanka
  export let wait: Promise<any>
  let img: string

  onMount(() => {
    wait.then(() => {
      img = userImageCache.get(tanka.whom_id) ?? default_icon
    })
  })
</script>

<div class='tanka_container'>
  <a class='link' href={`/user/${tanka.whom_id}`}>
  <div class='user'>
    {#await wait}
    <img src={default_icon} alt="">
    {:then}
    <img src={img} alt="">
    {/await}
    <p class='whom'>{tanka.whom}<span> @{tanka.whom_id}</span></p>
  </div>
  </a>
  <p class='tanka'>「 {tanka.meigen} 」</p>
  <i><p class='poet'>{tanka.poet}</p></i>
  <p class='time'>{(() => {
    const date = new Date(tanka.created_at.Time)
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

<style>
  a {
    text-decoration: none;
    color: inherit;
  }
  a:hover {
    opacity: 0.8;
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
  .user {
    display: flex;
    align-items: center;
    p {
      margin-left: 20px;
    }
    img {
      width: 50px;
    }
  }
  .tanka {
    font-size: 18px;
    filter: drop-shadow(3px 3px 0px #000000);
  }
  .whom {
    margin: 0;
    font-size: 18px;
  }
  span {
    margin: 0;
    color: var(--color2)
  }
  .poet {
    margin: 0;
  }
</style>