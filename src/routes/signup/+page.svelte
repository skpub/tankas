<script lang="ts">
  import { PUBLIC_API_ORIGIN } from "$env/static/public"
  let result: { message: string } | null = null
  let status: boolean | null = null // null: not sent yet, true: success, false: failed.

  let username = ''
  let user_id = ''
  let email = ''
  let password = ''

  async function signup() {
    const form = new FormData()
    form.append('username', username)
    form.append('user_id', user_id)
    form.append('email', email)
    form.append('password', password)
    let response = await fetch(PUBLIC_API_ORIGIN + "/signup", {
      method: 'POST',
      body: form,
    })
    const result = await response.json()
    status = response.ok
    console.log(response)
  }
</script>

<div id='signup'>
  <h1>Tankas Sign up</h1>
  <form on:submit={signup}>
    <input name="username" bind:value={username}  placeholder="Username(表示名)" type="text">
    <input name="user_id"  bind:value={user_id}   placeholder="UserID(ログインに使うID)" type="text">
    <input name="email"    bind:value={email}     placeholder="Email" type="email">
    <input name="password" bind:value={password}  placeholder="Password" type="password">
    <!-- <button on:click={signup}>Sign up</button> -->
    <button>Sign up</button>
  </form>
  {#if status == null}
  {:else if status}
    <p>ユーザの追加に成功しました。</p>
  {:else}
    <p>ユーザの追加に失敗しました。</p>
  {/if}
</div>

<style>
  #signup {
    font-family: Arial, Helvetica, sans-serif;
    width: 250px;
    margin: 0 auto;
    h1 {
      text-align: center;
    }
  }
</style>