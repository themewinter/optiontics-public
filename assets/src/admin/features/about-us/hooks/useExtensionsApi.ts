/**
 * WordPress dependencies
 */
import { useState } from "@wordpress/element";
import { useDispatch, useSelect } from "@wordpress/data";

/**
 * Internal dependencies
 */
import Api from "@/api";
import { stores } from "@/globalConstant";
import "@/admin/features/about-us/store/store";

const getStatusAfterUpdate = (status: string): string => {
    switch (status) {
        case "install":
            return "activate";
        case "activate":
            return "deactivate";
        case "deactivate":
            return "activate";
        default:
            return status;
    }
};

const useExtensionsApi = () => {
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const { setExtensionsState } = useDispatch(stores.extensions);

    const { data, loading } = useSelect(
        (select: any) => select(stores.extensions).getExtensionsState(),
        [],
    );

    const getPlugins = async () => {
        if (data || loading) return;

        try {
            setExtensionsState({ loading: true });
            const res = await Api.extensions.getExtensions({
                type: "our-plugins",
            });
            if (res?.success) {
                setExtensionsState({ data: res.data });
            }
        } catch (error) {
            console.error("Error fetching extensions:", error);
        } finally {
            setExtensionsState({ loading: false });
        }
    };

    const updatePluginStatus = async (name: string, status: string) => {
        try {
            setActionLoading(name);
            const res = await Api.plugins.pluginUpdate({ name, status });
            if (res?.success) {
                const newStatus = getStatusAfterUpdate(status);
                const updated = (data ?? []).map((plugin: any) =>
                    plugin.name === name
                        ? { ...plugin, status: newStatus }
                        : plugin,
                );
                setExtensionsState({ data: updated });
            }
        } catch (error) {
            console.error("Error updating plugin:", error);
        } finally {
            setActionLoading(null);
        }
    };

    return {
        pluginsData: data,
        loading,
        actionLoading,
        getPlugins,
        updatePluginStatus,
    };
};

export default useExtensionsApi;
