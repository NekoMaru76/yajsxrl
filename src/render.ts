import type { Children, Defaults, ElementType } from "./render.d.ts";
import { isFunction } from "./util.ts";

export class XElement extends HTMLElement {
    constructor(_props: Defaults, children: Children) {
        super();
        for (const child of children) {
            this.appendChild(typeof child === "string" ? new Text(child) : child);
        }
    }
}

export function createXElement<P extends Defaults>(ElType: ElementType<P>, props: P, children: XElement[]) {
    return isFunction(ElType) ? ElType(props, children) : new ElType(props, children);
}

export {
    createXElement as h
}