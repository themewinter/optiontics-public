declare const wp: Record<string, any>;

declare module "@wordpress/api-fetch" {
    const apiFetch: any;
    export default apiFetch;
}

declare module "@wordpress/element" {
    import * as React from "react";
    export = React;
}

declare module "@wordpress/data" {
    type SelectFn = <T = any>(storeName: string) => T;

    export const select: SelectFn;
    export const dispatch: <T = any>(storeName: string) => T;
    export function subscribe(callback: () => void): () => void;

    export function useSelect<T>(
        mapSelect: (select: SelectFn) => T,
        deps?: ReadonlyArray<unknown>,
    ): T;

    export function useDispatch<T = any>(storeName?: string): T;

    export function createReduxStore<T = any>(
        key: string,
        options: {
            reducer: (state: T, action: any) => T;
            actions?: Record<string, (...args: any[]) => any>;
            selectors?: Record<string, (state: T, ...args: any[]) => any>;
            controls?: Record<string, (...args: any[]) => any>;
            resolvers?: Record<string, (...args: any[]) => any>;
            initialState?: T;
        },
    ): any;

    export function register<T = any>(store: {
        name: string;
        instantiate: () => T;
    }): void;
}
