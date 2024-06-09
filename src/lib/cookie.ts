export function setCookie(name: string, value: string, duration_min: number) {
  const date = new Date();
  date.setTime(date.getTime() + duration_min * 60 * 1000)
  document.cookie = `${name}=${value};expires=${date.toUTCString()}`
}

export function getCookie(name: string) {
  if (typeof document === 'undefined') {
    console.log("fuck")
    return null
  }
  const cookie = document.cookie.split(';').map(c => c.trim()).find(c => c.startsWith(name))
  return cookie ?
    cookie.split('=')[1] === '' ?
      null
      : cookie.split('=')[1]
    : null
}
