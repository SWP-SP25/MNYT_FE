declare module 'dom-to-image' {
    export function toPng(node: HTMLElement, options?: any): Promise<string>;
    // Add other functions you use from dom-to-image here
}