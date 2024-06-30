<script lang="ts">
  import { onMount } from 'svelte'
  import { page } from '$app/stores'
  import { fetchAndGetUserImg } from '../../userImageCache'
  import default_icon from '$lib/img/default_icon.png'
  import { getCookie } from '$lib/cookie'
  import { PUBLIC_API_ORIGIN } from "$env/static/public"
  import { notify } from '$lib/notificationStore'

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
    if (img_ret !== undefined) {
      img = img_ret 
    }
    const user_profile = await fetch(PUBLIC_API_ORIGIN + `/auth/fetch_user_prof?user_id=${user_id}`, {
      method: 'GET',
      headers: {
        Authorization: `${token}`
      }
    })
    const prof_data = await user_profile.json()
    prof = {
      name: prof_data["contents"].name,
      bio: prof_data["contents"].bio,
      following: prof_data["contents"]
    }
    inputName = prof.name
    inputBio = prof.bio
  })

  let inputName = ''
  let inputBio = ''

  async function sendName(event: KeyboardEvent) {
    if (event.ctrlKey && event.key === 'Enter') {
      const form = new FormData()
      form.append('name', inputName)
      const res = await fetch(PUBLIC_API_ORIGIN + `/auth/patch_user_name`, {
        method: 'PATCH',
        headers: {
          Authorization: `${token}`
        },
        body: form
      })
      res.json().then(_ => {
        notify('名前を更新できました')
      })
    }
  }
  async function sendBio(event: KeyboardEvent) {
    if (event.ctrlKey && event.key === 'Enter') {
      const form = new FormData()
      form.append('bio', inputBio)
      const res = await fetch(PUBLIC_API_ORIGIN + `/auth/patch_user_bio`, {
        method: 'PATCH',
        headers: {
          Authorization: `${token}`
        },
        body: form
      })
      res.json().then(_ => {
        notify('Bioを更新できました')
      })
    }
  }

  function selectFile() {
    const file = selectedFile.files ? selectedFile.files[0] : null
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        image = e.target?.result as string
      }
      selectedImage = true
      reader.readAsDataURL(file)
    }
  }
  let image = default_icon
  let selectedFile: HTMLInputElement
  let selectedImage = false

  async function cropAndSend() {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    canvas.width = 256
    canvas.height = 256
    img.src = image
    img.onload = async () => {
      const blob = await new Promise<Blob>(resolve => {
        ctx?.drawImage(img, 0, 0, img.width, img.height, 0, 0, 256, 256)
        canvas.toBlob(blob => {
          resolve(blob as Blob)
        })
      })
      const form = new FormData()
      form.append('image', blob, 'img.png')
      fetch(PUBLIC_API_ORIGIN + '/auth/patch_user_img', {
        method: 'PATCH',
        headers: {
          Authorization: `${token}`,
          ContentType: 'multipart/form-data'
        },
        body: form
      }).then(res => {
        res.json().then(_ => {
          notify('画像を更新できました')
        })
      })
    }
  }
</script>

<div id='user_profile_container'>
<h1>{user_id}</h1>
{#if user_id===me}
  <div id='user_profile'>
    <div id='user_img'>
      <img src={img} alt="">
      <input type="file" accept="image/*" bind:this={selectedFile} on:change={selectFile}>
      {#if selectedImage}
        <button on:click={cropAndSend}>画像を更新</button>
      {/if}
    </div>
    <div>
      <table><tbody>
        <tr>
          <th></th>
          <td>入力後にCtrl+Enterで送信</td>
        </tr>
        <tr>
          <th>名前:</th>
          <td>
            <input type="text" bind:value={inputName} on:keydown={sendName}>
          </td>
        </tr>
        <tr>
          <th>Bio:</th>
          <td>
            <textarea bind:value={inputBio} on:keydown={sendBio}></textarea>
          </td>
        </tr>
      </tbody></table>
    </div>
  </div>
{:else}
  <div id='user_profile'>
    <img src={img} alt="">
    <div>
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
      <button>{prof.following ? 'フォロー解除': 'フォロー'}</button>
    </div>
  </div>
{/if}
</div>

<style>
  #user_profile_container {
    margin: 0 auto;
    text-align: center;
    padding-bottom: 100px;
  }
  #user_img {
    display: flex;
    flex-flow: column;
    input {
      width: 100px;
    }
  }
  #user_profile {
    display: flex;
    flex-direction: row;
    align-items: center;
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
  td {
    max-width: 300px;
  }
  th {
    vertical-align: top;
  }
</style>