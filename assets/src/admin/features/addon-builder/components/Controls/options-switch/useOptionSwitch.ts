import { useState, useCallback } from "react";

export interface UseOptionSwitchOptions {
	/** Initial toggle state (default: false) */
	defaultChecked?: boolean;
	/** Called after the internal state changes */
	onChangeSideEffect?: (checked: boolean) => void;
}

export interface UseOptionSwitchReturn {
	checked: boolean;
	onChange: (checked: boolean) => void;
	toggle: () => void;
}

/**
 * useOptionSwitch — optional local-state hook for uncontrolled usage.
 */
export function useOptionSwitch({
	defaultChecked = false,
	onChangeSideEffect,
}: UseOptionSwitchOptions = {}): UseOptionSwitchReturn {
	const [checked, setChecked] = useState<boolean>(defaultChecked);

	const onChange = useCallback(
		(value: boolean) => {
			setChecked(value);
			onChangeSideEffect?.(value);
		},
		[onChangeSideEffect],
	);

	const toggle = useCallback(() => {
		setChecked((prev) => {
			const next = !prev;
			onChangeSideEffect?.(next);
			return next;
		});
	}, [onChangeSideEffect]);

	return { checked, onChange, toggle };
}
