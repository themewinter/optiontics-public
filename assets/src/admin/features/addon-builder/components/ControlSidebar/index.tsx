/**
 * WordPress dependencies
 */
import { useMemo } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";

/**
 * External dependencies
 */
import { useEditor } from "@craftjs/core";
import { useDispatch } from "@wordpress/data";

/**
 * Internal dependencies
 */
import emptyStateImg from "@/../images/empty-state.png";
import { stores } from "@/globalConstant";
import { Button } from "@/shadcn/components/ui";

/**
 * Control sidebar component that displays settings for the currently selected node.
 */
const ControlSidebar = () => {
    const { selected, isEnabled } = useEditor((state, query) => {
        const currentNodeId = query.getEvent("selected").last();
        let selected;

        if (currentNodeId) {
            selected = {
                id: currentNodeId,
                name: state.nodes?.[currentNodeId]?.data?.displayName,
                settings: state.nodes?.[currentNodeId]?.related?.settings,
                isDeletable: query.node(currentNodeId).isDeletable(),
            };
        }

        return {
            selected,
            isEnabled: state.options.enabled,
        };
    });

    /**
     * Render the settings component for the selected node.
     */
    const settingsComponent = useMemo(() => {
        if (!selected?.settings) {
            return null;
        }

        const SettingsComponent = selected.settings;
        return <SettingsComponent />;
    }, [selected?.settings]);
        
    const { setAddonBuilderState } = useDispatch(stores?.addons);

    /**
     * Empty state component when no block is selected.
     */
    const EmptyState = () => (
        <div className="flex flex-col items-center justify-center h-full py-12 px-6 text-center gap-6">
            <img
                src={emptyStateImg}
                alt={__("No block selected", "optiontics")}
                className="w-56 h-auto"
            />
            <div className="emtpy-content-state">
                <span className="font-semibold text-xl text-gray-900 mb-2">
                    {__("Click on a component to start editing.", "optiontics")}
                </span>
                <p className="text-gray-500 text-md">
                    {__("Click on a block in the canvas to view and edit its properties.", "optiontics")}
                </p>
            </div>
            <div className="flex items-center gap-3">
                <Button
                    size="lg"
                    variant="default"
                    className="gap-2"
                    onClick={() => setAddonBuilderState({ collapsed: true })}
                >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    {__("Add Elements", "optiontics")}
                </Button>
            </div>
        </div>
    );

    if (!isEnabled) {
        return null;
    }

    return (
        <div className="w-full lg:w-[495px] bg-white border border-[#E5E7EB] rounded-md m-4 ml-0 overflow-y-auto mb-2 opt-builder-control-sidebar">
            {selected ? (
                <div className="p-4">
                    <h3 className="font-semibold text-lg mb-4 text-gray-900 mt-0!">
                       {sprintf(__("Edit %s", "optiontics"), selected.name || __("Control Panel", "optiontics"))}
                    </h3>
                    <div className="space-y-4">{settingsComponent}</div>
                </div>
            ) : (
                <EmptyState />
            )}
        </div>
    );
};

export default ControlSidebar;
