const mapping = {
  "1": "C",
  "2": "C#/Db",
  "3": "D",
  "4": "D#/Eb",
  "5": "E",
  "6": "F",
  "7": "F#/Gb",
  "8": "G",
  "9": "G#/Ab",
  "10": "A",
  "11": "A#/Bb",
  "12": "B",
}

export function notationToNumber(note: string): number {
  const [octave, semitoneIdx] = note.split("`")
  return Number(octave) * 12 + Number(semitoneIdx)
}

export function numberToNotation(
  number: number,
  format: string = "x`y (Lx)",
  sharp: string = "♯",
  flat: string = "♭"
): string {
  //   1 = 0`1 = C0
  const octave = String(Math.floor((number - 1) / 12))
  const semitoneIdx = String(number % 12 || 12)
  let noteStr = format
  noteStr = noteStr.replaceAll("x", octave)
  noteStr = noteStr.replaceAll("y", semitoneIdx)
  let letter = mapping[semitoneIdx]
  if (letter.includes("/")) {
    let [prevSharp, nextFlat] = letter.split("/")
    const noteNames = []
    if (sharp) {
      noteNames.push(prevSharp.replace("#", sharp))
    }
    if (flat) {
      noteNames.push(nextFlat.replace("b", flat))
    }
    letter = noteNames.length > 1 ? noteNames.join("/") : noteNames[0]
  }
  noteStr = noteStr.replaceAll("L", letter)

  return noteStr
}
