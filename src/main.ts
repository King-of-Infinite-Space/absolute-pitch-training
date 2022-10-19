import "./css/pico.css"
import "./css/pico-custom.scss"
// global styles
import App from "./App.svelte"

const app = new App({
  target: document.getElementById("app"),
})

export default app
