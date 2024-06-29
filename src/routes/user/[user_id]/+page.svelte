<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { fetchAndGetUserImg } from '../../userImageCache';
  import default_icon from '$lib/img/default_icon.png';
  import { getCookie } from '$lib/cookie';
  import { PUBLIC_API_ORIGIN } from "$env/static/public"

  let token = getCookie('token');
  let me = getCookie('user_id');

  let user_id;
  $: user_id = $page.params.user_id;

  let img = default_icon

  type userProfile = {
    name: string,
    bio: string,
    following: boolean
  }

  let prof: userProfile = {
    name: '',
    bio: '',
    following: false
  }

  onMount(async () => {
    const img_ret = await fetchAndGetUserImg(user_id, token?? '');
    img = img_ret 
    const user_profile = await fetch(PUBLIC_API_ORIGIN + `/auth/fetch_user_prof?user_id=${user_id}`, {
      method: 'GET',
      headers: {
        Authorization: `${token}`
      }
    })
    const prof_data = await user_profile.json()
    prof = {
      name: prof_data["contents"].name,
      bio: typeof prof_data["contents"].bio === 'object' ? '何も書かれていない' : prof_data["contents"].bio,
      following: prof_data["contents"]
    }
  })
</script>

<div id='user_profile'>
  <img src={img} alt="">
  <div>
    <h1>{user_id}</h1>
    <table><tbody>
      <tr>
        <th>名前:</th>
        <td>{prof.name}</td>
      </tr>
      <tr>
        <th>Bio:</th>
        <td>{prof.bio}</td>
      </tr>
    </tbody></table>
    {#if me !== user_id}
    <button>{prof.following ? 'フォロー解除': 'フォロー'}</button>
    {/if}
  </div>
</div>

<style>
  #user_profile {
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 100vh;
    justify-content: center;
  }
  img {
    width: 100px;
    height: 100px;
    margin-right: 24px;
  }
  button {
    width: 100px;
  }
</style>