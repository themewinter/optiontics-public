import { Option } from "../../../components/Controls/options";

export const useOptionHandlers = (update: (fn: (opts: Option[]) => Option[]) => void) => {
    
    const toggle = (checked: boolean) => {
        update((opts: Option[]) =>
            opts.map((opt) => ({
                ...opt,
                default: Boolean(checked)
            }))
        );
    };

    return { toggle };
};

