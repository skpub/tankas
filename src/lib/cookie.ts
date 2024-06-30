import { PUBLIC_API_ORIGIN } from "$env/static/public";
import { writable, type Writable } from "svelte/store";

export function setCookie(name: string, value: string, duration_min: number) {
  const date = new Date();
  date.setTime(date.getTime() + duration_min * 60 * 1000)
  document.cookie = `${name}=${value};expires=${date.toUTCString()}`
}

export let loggedIn: Writable<boolean> = writable(false)

export function getCookie(name: string) {
  if (typeof document === 'undefined') {
    return null
  }
  const cookie = document.cookie.split(';').map(c => c.trim()).find(c => c.startsWith(name))
  return cookie ?
    cookie.split('=')[1] === '' ?
      null
      : cookie.split('=')[1]
    : null
}

async function refreshToken() {
  const token = getCookie('token') as string
  const user_id = getCookie('user_id') as string
  const ret = await fetch(PUBLIC_API_ORIGIN + '/auth/refresh_token', {
    method: 'GET',
    headers: {
      Authorization: `${token}`,
    }
  })
  ret.json().then(data => {
    setCookie('token', data.token, 5)
    setCookie('user_id', user_id, 5)
  })
}

let refreshTimer: number

export async function refreshTokenPeriodically() {
  console.log("テスト")
  loggedIn.set(true)
  clearInterval(refreshTimer)
  refreshTimer = setInterval(refreshToken, (4 * 60 * 1000) + 50 * 1000)
}
