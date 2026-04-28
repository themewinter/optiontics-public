/**
 * External dependencies
 */
import { CpuIcon, PlugIcon } from "lucide-react";

/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";

/**
 * Internal dependencies
 */
import { cn } from "@/shadcn/lib/utils";

import type { SettingsTabId } from "../types";

interface SettingsSidebarProps {
    active: SettingsTabId;
    onChange: (next: SettingsTabId) => void;
}

const TABS: Array<{ id: SettingsTabId; label: string; Icon: typeof CpuIcon }> =
    [
        { id: "ai", label: __("General", "optiontics"), Icon: CpuIcon },
        {
            id: "integrations",
            label: __("Integrations", "optiontics"),
            Icon: PlugIcon,
        },
    ];

export function SettingsSidebar({ active, onChange }: SettingsSidebarProps) {
    return (
        <aside className="w-full md:w-56 shrink-0">
            <div className="rounded-xl border border-(--opt-border) bg-white min-h-50">
                <nav className="flex flex-col gap-0.5 p-2">
                    {TABS.map(({ id, label, Icon }) => {
                        const isActive = id === active;
                        return (
                            <button
                                key={id}
                                type="button"
                                onClick={() => onChange(id)}
                                className={cn(
                                    "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-left transition-colors w-full cursor-pointer",
                                    isActive
                                        ? "bg-indigo-50 text-indigo-700 font-medium"
                                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-700",
                                )}
                            >
                                <Icon size={15} className="shrink-0" />
                                <span>{label}</span>
                            </button>
                        );
                    })}
                </nav>
            </div>
        </aside>
    );
}
