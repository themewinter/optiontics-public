/**
 * WordPress dependencies
 */
import { Fragment, ReactNode } from "@wordpress/element";

/**
 * Represents the condition to check.
 */
type Condition<Value = unknown> = Value | boolean;

/**
 * Props for the If component.
 * @template Value Optional type of the condition value.
 */
type IfProps<Value = unknown> = {
    /**
     * The condition to determine what to render.
     * If truthy, `children` is rendered; otherwise, `fallback` is rendered (if provided).
     */
    condition: Condition<Value>;
    /**
     * What to render if condition is truthy.
     * Can be a render function receiving the condition value, or ReactNode.
     */
    children: ReactNode | ((value: Value) => ReactNode);
    /**
     * What to render if condition is falsy.
     */
    fallback?: ReactNode;
};

/**
 * Conditionally renders children or fallback based on the given condition.
 *
 * If `children` is a function, the condition value is passed to it.
 * If the condition is falsy, `fallback` (if provided) is rendered, otherwise nothing is rendered.
 *
 * @example
 * // Basic condition
 * <If condition={isLoggedIn}>Welcome back!</If>
 *
 * @example
 * // With fallback
 * <If condition={user}>
 *   {(u) => <>Hello, {u.name}</>}
 *   fallback="Not signed in"
 * </If>
 *
 * @param {IfProps<Value>} props Component props
 * @returns {ReactNode | null}
 */
export function If<Value = unknown>({
    condition,
    children,
    fallback = null,
}: IfProps<Value>): ReactNode | null {
    if (condition) {
        if (typeof children === "function") {
            return <Fragment>{(children as (v: Value) => ReactNode)(condition as Value)}</Fragment>;
        }
        return <Fragment>{children}</Fragment>;
    }
    return fallback ? <Fragment>{fallback}</Fragment> : null;
}
