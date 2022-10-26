<div class="flex-c mb1">
  <button on:click={playNewNote} disabled={state === 1}>Play new note</button>
</div>
<div class="flex-c mb1">
  <audio controls src="" bind:this={player} />
</div>

<div class="slider-wrapper mb15">
  <div class="label">Answer</div>
  <RangeSlider
    bind:values
    bind:activeHandle
    min={maxRange[0]}
    max={maxRange[1]}
    fixedIdx={1}
    pips
    pipstep={4}
    float
    first="label"
    last="label"
    rest="label"
    formatter={tickFormatter}
    {handleFormatter}
    hoverable={false}
    pushy
    disabled={state === 0}
    id="answer-slider"
  />
</div>
<div class="flex-c" id="confirm-wrapper">
  <div class="flex-c mb1">
    <button
      class="secondary outline"
      disabled={state === 0}
      on:click={() => {
        values[0]--
      }}>-</button
    >
    <button
      class="secondary outline"
      disabled={state === 0}
      on:click={() => {
        values[0]++
      }}>+</button
    >
  </div>
  <div class="flex-c mb1">
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
</div>
<div id="feedback-wrapper" class="mb1 {state === 2 ? '' : 'hide'}">
  {#each feedbacks as feedback}
    <div class="flex-c">
      {feedback}
    </div>
  {/each}
  <div class="flex-c">
    <div class={state === 2 && error === 0 ? "correct" : "hide"}>Correct!</div>
    <div class={state === 2 && error != 0 ? "" : "hide"}>
      Error =
      <span class={error < 0 ? "negative" : "positive"}>{errorStr}</span>
    </div>
  </div>
</div>

<script lang="ts">
import { onMount } from "svelte"
import RangeSlider from "../lib/RangeSlider.svelte"
import { handleFormatter, tickFormatter } from "./2-RangeSelection.svelte"
import { numberToNotation } from "../utils/notation"
import { records, selectedInstrument, selectedRange } from "./stores"
// C1 = 1`1 = 13, B7 = 7`12 = 96
// C2 = 2`1 = 25, B6 = 6`12 = 84
// A4 = 4`10 = 58
export let maxRange
export let state

let player: HTMLAudioElement
let values = [58]
let activeHandle = 0
let feedbacks = ["", ""]

let error = null
let repeats = 0
let currentNote = null

$: errorStr = error < 0 ? `${error}` : `+${error}`

$: selectedNote = values[0]

onMount(() => {
  player.onplay = () => {
    repeats++
  }
})

function getSoundUrl(noteNumber: number, instrument: string) {
  const noteName = numberToNotation(noteNumber, "Lx", "", "b")
  return `https://cdn.jsdelivr.net/gh/gleitz/midi-js-soundfonts@gh-pages/FluidR3_GM/${instrument}-mp3/${noteName}.mp3`
  // soundUrl = `https://gleitz.github.io/midi-js-soundfonts/FluidR3_GM/${instrument}-mp3/${note}.mp3`
}

function playNote() {
  player.src = getSoundUrl(currentNote, $selectedInstrument)
  player.play()
  activeHandle = state === 2 ? 1 : 0
}

function playSelectedNote() {
  player.src = getSoundUrl(selectedNote, $selectedInstrument)
  player.play()
  activeHandle = 0
}

function playNewNote() {
  state = 1
  values = [selectedNote]
  activeHandle = 0
  repeats = 0

  currentNote = Math.floor(
    Math.random() * ($selectedRange[1] - $selectedRange[0]) + $selectedRange[0]
  )
  playNote()
}

function confirmAnswer() {
  error = selectedNote - currentNote
  const record = {
    target: numberToNotation(currentNote, "x`y"),
    answer: numberToNotation(selectedNote, "x`y"),
    error: error,
    repeats: repeats,
    time: new Date().toISOString(),
  }
  records.update((records) => [record, ...records])
  feedbacks[0] = `Your answer = ${numberToNotation(selectedNote)}`
  feedbacks[1] = `Correct answer = ${numberToNotation(currentNote)}`
  state = 2
  values = [selectedNote, currentNote]
  activeHandle = 1
}
</script>

<style lang="scss">
.slider-wrapper {
  display: flow-root;
}
#confirm-wrapper {
  flex-wrap: wrap;
  > div {
    margin-left: 0px;
    margin-right: 0px;
  }
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
:global(#answer-slider > .rangeHandle.fixed > *) {
  background-color: var(--primary);
}
</style>
