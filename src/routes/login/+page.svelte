<script lang="ts">
    import { notify } from "$lib/notificationStore";

  let user_id = ''
  let password = ''
  let result: { token: string } | null = null // null: not sent yet, true: success, false: failed.

  async function login() {
    const form = new FormData()
    form.append('user_id', user_id)
    form.append('password', password)
    let response = await fetch('http://localhost:8080/login', {
      method: 'POST',
      body: form,
    })
    result = await response.json()
    if (response.ok) {
      notify('トークンを得た！')
    } else {
      notify('ログインに失敗')
    }
  }
</script>

<div id='login'>
  <h1>Tankas Login</h1>
  <form on:submit={login}>
    <input name="user_id"  bind:value={user_id}   placeholder="UserID(ログインに使うID)" type="text">
    <input name="password" bind:value={password}  placeholder="Password" type="password">
    <button>Sign up</button>
  </form>
</div>

<style>
  #login {
    font-family: Arial, Helvetica, sans-serif;
    width: 250px;
    margin: 0 auto;
    h1 {
      text-align: center;
    }
  }
</style>