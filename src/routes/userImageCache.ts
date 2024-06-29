import { PUBLIC_API_ORIGIN } from "$env/static/public"

export const userImageCache:Map<string, string> = new Map()

function base64ToBlob(base64: string): Blob {
  const bin = atob(base64)
  const buffer = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) {
    buffer[i] = bin.charCodeAt(i)
  }
  return new Blob([buffer.buffer], {type: 'image/png'})
}

export async function fetchAndGetUserImg(id: string, token: string): Promise<string> {
  const singleton_set = new Set<string>()
  singleton_set.add(id)
  const ret = await fetchUserImgCache(singleton_set, token)
  return userImageCache.get(id) as string
}

export async function fetchUserImgCache(ids: Set<string>, token: string) {
  let to_be_fetched:string[] = []
  for (const id of ids) {
    if (!userImageCache.has(id)) {
      to_be_fetched.push(id)
    }
  }
  const img = await fetch(PUBLIC_API_ORIGIN + `/auth/fetch_user_imgs?user_ids=${to_be_fetched.join(',')}`,
    {
      method: 'GET',
      headers: {
        Authorization: `${token}`,
      }
    }
  )
  const data = await img.json()
  for (const [id, img] of Object.entries(data["contents"])) {
    if (img !== null) {
      userImageCache.set(id, URL.createObjectURL(base64ToBlob(img as string)))
    }
  }
}