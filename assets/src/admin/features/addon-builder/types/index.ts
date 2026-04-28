
type SetAttributeFn<T> = (attrKey: string, value: T[keyof T]) => void;

export interface ControlGeneratorProps<T extends Record<string, any>> {
    attrKey?: string;
	attributes: T;
	setAttribute: SetAttributeFn<T>;
}

export interface Control {
    label?: string;
    type?: string;
    children?: Record<string, Control>;
    [key: string]: string | number | boolean | Record<string, any> | Record<string, Control> | undefined;
}