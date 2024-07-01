import { writable } from 'svelte/store'

export type Tanka = {
  meigen_id: string,
  meigen: string,
  whom_id: string,
  whom: string,
  group_id: string,
  group: string,
  poet: string,
  poets_id: string,
  created_at: { Time: string, Valid: boolean },
}

export const tanka_msg = writable<Tanka>()