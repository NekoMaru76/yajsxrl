import type { SetState, JSX } from "./render.d.ts";

export class XElement<P = any> extends HTMLElement {
    constructor(
        public props: P,
        public vchildren: any,
        public setState: SetState,
    ) {
        super();
        appendChildren(this, vchildren);
    }
    render() {
        for (const child of this.children) if (child instanceof XElement) child.render();
    }
}

export function appendChildren(el: HTMLElement, children: any) {
    if (!Array.isArray(children)) el.appendChild(new Text(children + ""));
    else for (const child of children) {
        el.appendChild(
            child instanceof HTMLElement ? child : new Text(child + ""),
        );
    }
}

export function createXElement<P = any>(
    ElType: JSX.ElementType<P>,
    props: P,
    ...children: any
) {
    const setState: SetState = (cb) => {
        cb?.();
        
        el.render();
    };
    const el = new ElType(props, children, setState);

    el.render();

    return el;
}

export function register(name: string, ElType: JSX.ElementType<any>) {
    customElements.define(name, ElType);
}

export { createXElement as h };
