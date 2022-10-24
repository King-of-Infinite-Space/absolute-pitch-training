import { writable } from 'svelte-local-storage-store'

export const records = writable('records', [])