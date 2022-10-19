<div class="wrapper">
  <div class="label">Test range ({range[1] - range[0] + 1} notes)</div>
  <RangeSlider
    id="range-slider"
    bind:values={range}
    min={maxRange[0]}
    max={maxRange[1]}
    pips
    pipstep={4}
    float
    first="label"
    last="label"
    formatter={(value, index, percent) => numberToNotation(value)}
    range
    hoverable={false}
    disabled={waitingForAnswer}
  />
</div>

<script lang="ts">
import RangeSlider from "../lib/RangeSlider.svelte"
import { numberToNotation } from "../utils/notation"

export let maxRange
export let range
export let waitingForAnswer
</script>

<style>
.wrapper {
  display: flow-root;
}
</style>
