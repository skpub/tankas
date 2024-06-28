<script lang="ts">
    import { notify } from "$lib/notificationStore";
    import { setCookie } from "$lib/cookie";
    import { goto } from "$app/navigation";
    import { PUBLIC_API_ORIGIN } from "$env/static/public"

  let user_id = ''
  let password = ''
  let result: { token: string } | null = null // null: not sent yet, true: success, false: failed.

  async function login() {
    const user_id_ = user_id
    const form = new FormData()
    form.append('user_id', user_id)
    form.append('password', password)
    try {
      let response = await fetch(PUBLIC_API_ORIGIN + "/login", {
        method: 'POST',
        body: form,
      })
      result = await response.json()
      if (response.ok) {
        notify('トークンを得た！')
        goto('/')
        if (result != null) {
          setCookie('token', result.token, 30)
          setCookie('user_id', user_id_, 30)
        }
        else notify('何かがおかしい。ログイン成功なのにトークンが返ってこない。')
      } else {
        notify('ログインに失敗')
      }
    } catch {
      notify('サーバが死んではるわ。')
    }
  }
</script>

<div id='login'>
  <h1>Tankas Login</h1>
  <form on:submit={login}>
    <input name="user_id"  bind:value={user_id}   placeholder="UserID" type="text">
    <input name="password" bind:value={password}  placeholder="Password" type="password">
    <button>Log in</button>
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