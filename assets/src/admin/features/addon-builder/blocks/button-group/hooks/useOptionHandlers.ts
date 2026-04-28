import { Option } from "../../../components/Controls/options";

export const useOptionHandlers = (
    update: (fn: (opts: Option[]) => Option[]) => void,
    multiSelect: boolean,
) => {
    const select = (index: number) => {
        update((opts: Option[]) =>
            opts.map((opt, i) => {
                if (multiSelect) {
                    return {
                        ...opt,
                        default: i === index ? !opt.default : opt.default,
                    };
                }
                return {
                    ...opt,
                    default: i === index ? !opt.default : false,
                };
            }),
        );
    };

    const remove = (index: number) => {
        update((opts: Option[]) => opts.filter((_, i) => i !== index));
    };

    return { select, remove };
};
