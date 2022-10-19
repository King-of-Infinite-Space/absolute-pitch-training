<main class="container">
  <!-- pico class for centered viewport -->
  <h4 class="heading">
    Aboslute Pitch Training
    <!-- <h5>a.k.a. frequency detection</h5> -->
  </h4>

  <section>
    <SelectInstrument bind:instrument />
    <RangeSlider
      bind:range={noteRange}
      {maxRange}
      waitingForAnswer={state === 1}
    />
  </section>
  <section>
    <PlayAndAnswer
      testRange={noteRange}
      {maxRange}
      bind:instrument
      bind:state
    />
  </section>
</main>

<script lang="ts">
import SelectInstrument from "./components/1-Instrument.svelte"
import RangeSlider from "./components/2-RangeSlider.svelte"
import PlayAndAnswer from "./components/3-PlayAndAnswer.svelte"

let instrument = "electric_piano_1"
const maxRange = [13, 96]
let noteRange = [37, 72]
// let noteRange = [25, 84]
// C1 = 1`1 = 13, B7 = 7`12 = 96
// C2 = 2`1 = 25, B6 = 6`12 = 84
// C3 = 3`1 = 37, B5 = 5`12 = 72
let state = 0
// 0 = start, 1 = waiting for anwer, 2 = answered
</script>

<style>
</style>
