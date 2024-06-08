import { writable } from 'svelte/store'

export const notifications = writable<string[]>([])

export function notify(msg: string, duration = 2000) {
  notifications.update(v => [...v, msg])
  setTimeout(() => notifications.update(v => {
    let temp = v.slice()
    temp.reverse()
    temp.pop()
    temp.reverse()
    return temp
  }), duration)

  // notifications.update(current => [...current, msg])
  // setTimeout(() => {
  //   notifications.update(current => current.filter(n => n !== msg))
  // }, duration)
}
