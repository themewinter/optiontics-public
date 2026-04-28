/**
 * WordPress dependencies
 */
import { useEffect } from "@wordpress/element";
import { __ } from "@wordpress/i18n";

/**
 * Internal dependencies
 */
import useExtensionsApi from "@/admin/features/about-us/hooks/useExtensionsApi";
import PluginCard from "@/admin/features/about-us/components/PluginCard";
import PluginCardSkeleton from "@/admin/features/about-us/components/PluginCardSkeleton";

const OurPlugins = () => {
    const {
        pluginsData,
        loading,
        actionLoading,
        getPlugins,
        updatePluginStatus,
    } = useExtensionsApi();

    useEffect(() => {
        getPlugins();
    }, []);

    const isInitialLoading = loading && !pluginsData;

    return (
        <div className="flex flex-col gap-6">
            {/* Section header */}
            <div className="flex flex-col gap-2">
                <div className="text-2xl font-bold text-black/90">
                    {__("Our Plugins", "optiontics")}
                </div>
                <div className="text-black/60 text-sm">
                    {__(
                        "Powerful tools built for WordPress, trusted by thousands of businesses worldwide.",
                        "optiontics",
                    )}
                </div>
            </div>

            {/* Plugin cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {isInitialLoading
                    ? [1, 2, 3].map((i) => <PluginCardSkeleton key={i} />)
                    : (pluginsData ?? []).map((plugin: any) => (
                          <PluginCard
                              key={plugin.name}
                              {...plugin}
                              loading={actionLoading === plugin.name}
                              onAction={updatePluginStatus}
                          />
                      ))}
            </div>
        </div>
    );
};

export default OurPlugins;
