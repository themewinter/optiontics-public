import { useNode } from "@craftjs/core";
import { Option } from "../../../components/Controls/options";

export const useOptions = () => {
    const {
        props: nodeProps = {},
        actions: { setProp }
    } = useNode(node => ({
        props: node.data.props
    }));

    const options = (nodeProps.options ?? []) as Option[];

    const update = (fn: (opts: Option[]) => Option[]) => {
        setProp((prev: any) => {
            prev.options = fn(options);
            return prev;
        });
    };

    return { nodeProps, options, update };
};

