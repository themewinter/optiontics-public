/**
 * WordPress dependencies
 */
import { useEffect } from "@wordpress/element";

/**
 * Other library dependencies
 */
import { RouterProvider } from "react-router-dom";

/**
 * Internal dependencies
 */
import router from "@/admin/router";
import withAdminData from "@/admin/withAdminData";
import { openNotification } from "@/helpers";
import { ErrorBoundary } from "../common/components";

const App = (): JSX.Element => {
    // Add CSS class to body to hide WordPress admin menu
    useEffect(() => {
        document.body.classList.add("optiontics-active");

        return () => {
            document.body.classList.remove("optiontics-active");
        };
    }, []);

    useEffect(() => {
        // Register notification handler
        window.wp?.hooks?.addAction?.(
            "notification",
            "optiontics",
            openNotification,
        );
    }, []);

    return (
        <ErrorBoundary>
            <RouterProvider
                future={{
                    v7_startTransition: true,
                }}
                router={router}
            />
        </ErrorBoundary>
    );
};

export default withAdminData(App);
