/**
 * Wordpress dependencies
 */
import { ReactNode } from "@wordpress/element";
import { __ } from "@wordpress/i18n";

/**
 * Internal dependencies
 */
import { useEditor } from "@craftjs/core";

interface ViewportProps {
    children: ReactNode;
}

const Viewport = ({ children }: ViewportProps) => {
    const { connectors } = useEditor((state) => ({
        enabled: state.options.enabled,
    }));

    return (
        <div
            className="flex-1 flex craftjs-renderer flex-col"
            ref={(ref) => {
                if (ref) connectors.select(connectors.hover(ref, ""), "");
            }}
        >
            {children}
        </div>
    );
};

export default Viewport;
