export function isFunction(
    x: CallableFunction | {
        new (...args: any[]): any;
    },
): x is ({
    (...args: any[]): any;
}) {
    return x.prototype
        ? Object.getOwnPropertyDescriptor(x, "prototype")?.writable
            ? true
            : false
        : true;
}

export function codeToURI(code: string, lang = "typescript") {
    return `data:application/${lang};base64,${btoa(code)}`;
}
