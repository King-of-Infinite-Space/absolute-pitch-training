import { writable } from "svelte-local-storage-store"

export const selectedInstrument = writable(
  "selectedInstrument",
  "electric_piano_1"
)
export const selectedRange = writable("selectedRange", [25, 84])
// C1 = 1`1 = 13, B7 = 7`12 = 96
// C2 = 2`1 = 25, B6 = 6`12 = 84
// C3 = 3`1 = 37, B5 = 5`12 = 72

export const records = writable("records", [])
