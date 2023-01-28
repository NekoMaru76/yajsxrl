// @jsx createXElement
import { XElement, createXElement } from "reit";

customElements.define("x-element", XElement);

export default function App() {
    return <>Hello World!</>
}