<div class="wrapper mb2">
  <div class="label">
    Range ({$selectedRange[1] - $selectedRange[0] + 1} notes)
  </div>
  <RangeSlider
    id="range-slider"
    bind:values={$selectedRange}
    min={maxRange[0]}
    max={maxRange[1]}
    pips
    pipstep={4}
    float
    first="label"
    last="label"
    rest="label"
    formatter={tickFormatter}
    {handleFormatter}
    range
    hoverable={false}
    disabled={waitingForAnswer}
  />
</div>

<script lang="ts" context="module">
export function handleFormatter(value, index, percent) {
  return numberToNotation(value)
}

export function tickFormatter(value, index, percent) {
  return value % 12 === 1 ? numberToNotation(value, "x`y") : ""
}
</script>

<script lang="ts">
import RangeSlider from "../lib/RangeSlider.svelte"
import { numberToNotation } from "../utils/notation"
import { selectedRange } from "./stores"

export let maxRange
export let waitingForAnswer
</script>

<style>
.wrapper {
  display: flow-root;
}
</style>
