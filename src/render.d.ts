

export as namespace reit

import { JSXInternal } from "preact-jsx"
import type {
    XElement
} from "./render.ts"

export {
    JSXInternal as JSX
}

export type Children = (XElement | string)[]

// deno-lint-ignore ban-types
export type Defaults = object | string | number | null | undefined


export interface ClassElement<P extends Defaults> extends XElement {
    new(props: P, children: Children): XElement
}
export interface FunctionElement<P extends Defaults> {
    (props: P, children: Children): XElement
}

export type ElementType<P extends Defaults> = ClassElement<P> | FunctionElement<P>