<div class="flex-c">
  <button on:click={playNewNote} disabled={state === 1}>Play new note</button>
</div>
<div class="flex-c" id="player-wrapper">
  <audio controls src="" bind:this={player} />
</div>

<div class="wrapper">
  <div class="label">Your Answer</div>
  <RangeSlider
    bind:values={range}
    min={maxRange[0]}
    max={maxRange[1]}
    pips
    pipstep={4}
    float
    first="label"
    last="label"
    formatter={(value, index, percent) => numberToNotation(value)}
    hoverable={false}
    pushy
    disabled={state === 0}
  />
</div>
<div class="flex-c" id="confirm-wrapper">
  <button
    class="secondary outline"
    disabled={state === 0}
    on:click={() => {
      range[0]--
    }}>-</button
  >
  <button
    class="secondary outline"
    disabled={state === 0}
    on:click={() => {
      range[0]++
    }}>+</button
  >
  <button class="secondary" disabled={state === 0} on:click={playNote}
    >Play again</button
  >
  <button
    class="secondary {state === 2 ? '' : 'hide'}"
    on:click={playSelectedNote}>Play selected</button
  >
  <button class="contrast" disabled={state != 1} on:click={confirmAnswer}
    >Confirm</button
  >
</div>
<div id="feedback-wrapper">
  {#each feedbacks as feedback}
    <div class="flex-c {state === 2 ? '' : 'hide'}">
      {feedback}
    </div>
  {/each}
  <div class="flex-c">
    <div class={state === 2 && trialRecord.error === 0 ? "correct" : "hide"}>
      Correct!
    </div>
    <div class={state === 2 && trialRecord.error != 0 ? "" : "hide"}>
      Error =
      <span class={trialRecord.error < 0 ? "negative" : "positive"}
        >{errorStr}</span
      >
    </div>
  </div>
</div>

<script lang="ts">
import { onMount } from "svelte"
import RangeSlider from "../lib/RangeSlider.svelte"
import { numberToNotation } from "../utils/notation"
import { getRandomInstrument } from "../utils/instruments"
// C1 = 1`1 = 13, B7 = 7`12 = 96
// C2 = 2`1 = 25, B6 = 6`12 = 84
// A4 = 4`10 = 58
export let maxRange
export let testRange
export let instrument
export let state

let player: HTMLAudioElement
let range = [58]
let feedbacks = ["", ""]

let trialRecord = {
  noteNumber: null,
  error: null,
  repeats: 0,
}

$: errorStr =
  trialRecord.error < 0 ? `${trialRecord.error}` : `+${trialRecord.error}`

onMount(() => {
  player.onplay = () => {
    trialRecord.repeats++
  }
})

function getSoundUrl(noteNumber: number, instrument: string) {
  const noteName = numberToNotation(noteNumber, "Lx", "", "b")
  return `https://cdn.jsdelivr.net/gh/gleitz/midi-js-soundfonts@gh-pages/FluidR3_GM/${instrument}-mp3/${noteName}.mp3`
  // soundUrl = `https://gleitz.github.io/midi-js-soundfonts/FluidR3_GM/${instrument}-mp3/${note}.mp3`
}

function playNote() {
  player.src = getSoundUrl(trialRecord.noteNumber, instrument)
  player.play()
}

function playSelectedNote() {
  player.src = getSoundUrl(range[0], instrument)
  player.play()
}

function playNewNote() {
  state = 1
  trialRecord.repeats = 0

  trialRecord.noteNumber = Math.floor(
    Math.random() * (testRange[1] - testRange[0]) + testRange[0]
  )
  playNote()
}

function confirmAnswer() {
  // range.push(trialRecord.noteNumber)
  trialRecord.error = range[0] - trialRecord.noteNumber
  const record = {
    target: numberToNotation(trialRecord.noteNumber, "x`y"),
    answer: numberToNotation(range[0], "x`y"),
    error: trialRecord.error,
    repeats: trialRecord.repeats,
    datetime: new Date().toISOString(),
  }
  console.log(record)
  feedbacks[0] = `Your answer = ${numberToNotation(range[0])}`
  feedbacks[1] = `Correct answer = ${numberToNotation(trialRecord.noteNumber)}`
  state = 2
}
</script>

<style>
.wrapper {
  display: flow-root;
}
#player-wrapper {
  margin-top: var(--spacing);
}
#confirm-wrapper {
  margin-top: calc(1.5 * var(--spacing));
  margin-bottom: var(--spacing);
}
#feedback-wrapper > div {
  margin-bottom: calc(0.25 * var(--spacing));
}
.hide {
  display: none;
}
.correct {
  color: hsl(127, 50%, 42%);
}
.negative {
  color: hsl(223, 91%, 64%);
}
.positive {
  color: hsl(358, 87%, 58%);
}
/* primay blue: OKHSL 25/145/265 94 57 */
</style>
