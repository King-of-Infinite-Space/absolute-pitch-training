<div class="flex-c">
  <button on:click={playNewNote} disabled={state === 1}>Play new note</button>
</div>
<div class="flex-c" id="player-wrapper">
  <audio controls src="" bind:this={player} />
</div>

<div class="wrapper">
  <div class="label">Your Answer</div>
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
// C1 = 1`1 = 13, B7 = 7`12 = 96
// C2 = 2`1 = 25, B6 = 6`12 = 84
// A4 = 4`10 = 58
export let maxRange
export let testRange
export let instrument
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
  player.src = getSoundUrl(currentNote, instrument)
  player.play()
  activeHandle = state === 2 ? 1 : 0
}

function playSelectedNote() {
  player.src = getSoundUrl(selectedNote, instrument)
  player.play()
  activeHandle = 0
}

function playNewNote() {
  state = 1
  values = [selectedNote]
  activeHandle = 0
  repeats = 0

  currentNote = Math.floor(
    Math.random() * (testRange[1] - testRange[0]) + testRange[0]
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
    datetime: new Date().toISOString(),
  }
  console.log(record)
  feedbacks[0] = `Your answer = ${numberToNotation(selectedNote)}`
  feedbacks[1] = `Correct answer = ${numberToNotation(currentNote)}`
  state = 2
  values = [selectedNote, currentNote]
  activeHandle = 1
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
:global(#answer-slider > .rangeHandle.fixed > *) {
  background-color: var(--primary);
}
</style>
