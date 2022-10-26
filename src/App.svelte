<main class="container">
  <!-- pico class for centered viewport -->
  <h4 class="heading">
    Absolute Pitch Training
    <!-- <h5>a.k.a. frequency detection</h5> -->
  </h4>

  <SelectInstrument />

  <RangeSlider {maxRange} waitingForAnswer={state === 1} />

  <PlayAndAnswer {maxRange} bind:state />

  <Record />
</main>

<script lang="ts">
import SelectInstrument from "./components/1-Instrument.svelte"
import RangeSlider from "./components/2-RangeSelection.svelte"
import PlayAndAnswer from "./components/3-PlayAndAnswer.svelte"
import Record from "./components/4-Record.svelte"

const maxRange = [13, 96]
let state = 0
// 0 = start, 1 = waiting for anwer, 2 = answered
</script>
