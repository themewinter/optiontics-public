import { Option } from "../../../components/Controls/options";

export const useOptionHandlers = (update: (fn: (opts: Option[]) => Option[]) => void) => {
    
    const toggle = (index: number, checked: boolean) => {
        update((opts: Option[]) =>
            opts.map((opt, i) => ({
                ...opt,
                default: i === index ? checked : opt.default
            }))
        );
    };

    const remove = (index: number) => {
        update((opts: Option[]) => opts.filter((_, i) => i !== index));
    };

    const updateQuantity = (index: number, quantity: number) => {
        update((opts: Option[]) =>
            opts.map((opt, i) => ({
                ...opt,
                quantity: i === index ? quantity : opt.quantity
            }))
        );
    };

    return { toggle, remove, updateQuantity };
};
