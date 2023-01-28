// @jsx createXElement
import { 
    createXElement, 
    XElement, 
} from "../../mod.ts";
import {
    register,
    SetState, 
} from "../../mod.ts";
import { appendChildren } from "../../src/render.ts";




interface ButtonProps {
    onClick(e: MouseEvent): any
}

class Button extends XElement<ButtonProps> {
    constructor(props: ButtonProps, children: any, setState: SetState) {
        super(props, [], setState);

        const button = document.createElement("button");

        appendChildren(button, children);
        this.appendChild(button);
        this.addEventListener("click", props.onClick);
    }
}

class Counter extends XElement {
    count = 0;
    countEl: XElement;

    constructor(_: any, _1: any, setState: SetState) {
        const el = <>0</>;

        super(null, [
            el
        ], setState);

        this.countEl = el;

        this.appendChild(<Button onClick={() => {
            this.count++;
            
            setState();
        }}>Click Me!</Button>);
    }
    render() {
        this.countEl.innerText = `${this.count}`;
    }
}

export default function App() {
    return <Counter />;
}

register("x-element", XElement);
register("x-button", Button as any);
register("x-counter", Counter);