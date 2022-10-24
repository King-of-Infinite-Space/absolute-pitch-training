<details>
  <summary>Record</summary>
  <div class="flex-c">
    <button
      class="secondary"
      on:click={exportRecord}
      disabled={$records.length === 0}>Export</button
    >
    <button
      class="contrast"
      on:click={clearRecord}
      disabled={$records.length === 0}>Clear</button
    >
  </div>
  <figure>
    <table>
      <thead>
        <tr>
          {#each keys as k}
            <th scope="col">{k}</th>
          {/each}
        </tr>
      </thead>
      <tbody>
        {#each $records as record}
          <tr>
            <td>{toLocalTimeStr(record.time)}</td>
            <td>{record.error}</td>
            <td>{record.answer}</td>
            <td>{record.target}</td>
            <td>{record.repeats}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </figure>
</details>

<script>
import { get } from "svelte/store"
import { records } from "./stores"

const keys = ["time", "error", "answer", "target", "repeats"]

function exportRecord() {
  //   export record as csv
  const rows = [
    keys,
    ...Array.from(get(records), (entry) =>
      Array.from(keys, (key) => entry[key])
    ),
  ]
  const csvContent = arrayToCsv(rows)
  downloadBlob(
    csvContent,
    "absolute_pitch_training_export.csv",
    "text/csv;charset=utf-8;"
  )
}

function clearRecord() {
  if (confirm("Are you sure you want to clear the record?")) {
    records.set([])
  }
}

function toLocalTimeStr(isoStr) {
  const date = new Date(isoStr)
  const options = {
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
  }
  // @ts-ignore
  let dateStr = date.toLocaleDateString("en-US", options)
  return dateStr.replace(",", "").replaceAll("/", "-")
}

// simplified from https://stackoverflow.com/a/68146412/7866809
function arrayToCsv(rows) {
  function fmtValue(val) {
    if (typeof val === "number") {
      return val
    }
    return `"${String(val).replaceAll('"', '""')}"`
  }
  return rows.map((row) => row.map(fmtValue).join(",")).join("\r\n") // rows starting on new lines
}
function downloadBlob(content, filename, contentType) {
  // Create a blob
  var blob = new Blob([content], { type: contentType })
  var url = URL.createObjectURL(blob)

  // Create a link to download it
  var pom = document.createElement("a")
  pom.href = url
  pom.setAttribute("download", filename)
  pom.click()
}
</script>

<style>
button {
  font-size: small;
}
th,
td {
  text-align: center;
  font-size: small;
  padding: calc(var(--spacing) / 2);
}
</style>
