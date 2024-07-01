import type { Tanka } from "./tankaReceive"
import { PUBLIC_API_ORIGIN } from "$env/static/public"
import { fetchUserImgCache } from "../userImageCache"
import { notify } from "$lib/notificationStore"
import { goto } from "$app/navigation"

export async function tl_fetch(contents: Tanka[], token: string) {
  if (token != null) {
    const res = await fetch(PUBLIC_API_ORIGIN + `/auth/fetch_global_tl?before=${Date.now()+1}`, {
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
      }
      return fetchUserImgCache(user_ids, token)
    })
  } else {
    notify('トークンが期限を迎えました。')
    goto('/login')
    return Promise.reject('トークンが期限を迎えました。')
  }
}
