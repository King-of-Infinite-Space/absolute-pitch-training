<label for="ins">Instrument</label>
<div class="flex-r mb1">
  <select id="ins" bind:value={$selectedInstrument}>
    {#each instrumentGroups as group}
      <optgroup label={group}>
        {#each groupedInstruments[group] as ins}
          <option value={ins}>
            {ins.replaceAll("_", " ")}
          </option>
        {/each}
      </optgroup>{/each}
  </select>
  <button
    class="secondary"
    on:click={() => {
      selectedInstrument.set(getRandomInstrument())
    }}>Random</button
  >
</div>

<script lang="ts">
import groupedInstruments, {
  instrumentGroups,
  getRandomInstrument,
} from "../utils/instruments"

import { selectedInstrument } from "./stores"
</script>

<style>
select {
  flex-grow: 1;
}
</style>
