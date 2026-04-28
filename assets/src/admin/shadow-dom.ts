import ReactDOM from "react-dom/client";
import { createElement } from "@wordpress/element";
import ShadowContainerContext from "./shadow-dom-context";

interface ShadowDomOptions {
    element: HTMLElement | string;
    cssUrl?: string;
}

async function injectCssContent(shadow: ShadowRoot, cssUrl: string): Promise<void> {
    try {
        const response = await fetch(cssUrl);
        if (response.ok) {
            const css = await response.text();
            const style = document.createElement('style');
            style.textContent = css;
            shadow.appendChild(style);
        }
    } catch (error) {
        console.error('Failed to load CSS:', error);
    }
}

export async function renderInShadowDom(
    app: React.ReactElement, 
    options: ShadowDomOptions
): Promise<ReactDOM.Root> {
    const container = typeof options.element === 'string'
        ? document.querySelector(options.element)
        : options.element;

    if (!container) {
        throw new Error(`Element not found: ${options.element}`);
    }

    const shadow = container.attachShadow({ mode: 'open' });

    if (options.cssUrl) {
        await injectCssContent(shadow, options.cssUrl);
    }

    const wrapper = document.createElement('div');
    wrapper.id = 'optiontics-vendor-dashboard';
    shadow.appendChild(wrapper);

    const root = ReactDOM.createRoot(wrapper);
    root.render(
        createElement(ShadowContainerContext.Provider, { value: wrapper }, app)
    );
    return root;
}

export function getShadowRoot(element: HTMLElement | string): ShadowRoot | null {
    const container = typeof element === 'string'
        ? document.querySelector(element)
        : element;

    if (!container?.shadowRoot) {
        return null;
    }

    return container.shadowRoot;
}
