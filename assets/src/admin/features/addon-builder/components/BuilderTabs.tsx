/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { FC } from '@wordpress/element'
import { useDispatch, useSelect } from '@wordpress/data';

/**
 * External dependencies
 */
import { LayoutGrid, Pin, GitBranch } from 'lucide-react';

/**
 * Internal dependencies
 */
import { Tabs, TabsList, TabsTrigger } from '@/shadcn/components/ui'
import { stores } from '@/globalConstant';

const TABS = [
    {
        value: 'general',
        label: __('Advanced Settings', 'optiontics'),
        icon: LayoutGrid,
    },
    {
        value: 'styles',
        label: __('Appearance', 'optiontics'),
        icon: Pin,
    },
    {
        value: 'conditions',
        label: __('Conditional logic', 'optiontics'),
        icon: GitBranch,
    },
];

const BuilderTabs: FC<{ children: React.ReactNode }> = ({ children }) => {
    const { activeTab } = useSelect((select: any) =>
        select(stores?.addons).getAddonBuilderState(),
    );
    const { setAddonBuilderState } = useDispatch(stores?.addons);

    return (
        <Tabs
            value={activeTab}
            onValueChange={(value) => setAddonBuilderState({ activeTab: value })}
            className="w-full"
            defaultValue="general"
        >
            <TabsList className="w-full mb-3 h-auto bg-[#F3F4F6] border border-[#E5E7EB] rounded-[8px] p-1 flex items-center gap-0.5">
                {TABS.map(({ value, label, icon: Icon }) => (
                    <TabsTrigger
                        key={value}
                        value={value}
                        className="
                            flex-1 flex items-center justify-center gap-1.5
                            px-3 py-2 text-sm font-medium
                            text-[#6B7280] rounded-[6px]
                            transition-all duration-150
                            border border-transparent
                            data-[state=active]:bg-white
                            data-[state=active]:text-[#111827]
                            data-[state=active]:border-[#E5E7EB]
                            data-[state=active]:shadow-[0_1px_3px_0_rgba(0,0,0,0.08)]
                            focus-visible:outline-none
                        "
                    >
                        <Icon size={14} />
                        {label}
                    </TabsTrigger>
                ))}
            </TabsList>
            {children}
        </Tabs>
    );
}

export default BuilderTabs