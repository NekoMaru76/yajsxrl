// @jsx createXElement
import { XElement, createXElement } from "../../mod.ts";

customElements.define("x-element", XElement);

export default function App() {
    return <>Hello World!</>
}