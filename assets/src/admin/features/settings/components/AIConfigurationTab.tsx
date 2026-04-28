/**
 * External dependencies
 */
import { BotIcon, KeyRoundIcon } from "lucide-react";

/**
 * WordPress dependencies
 */
import { useEffect, useMemo, useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";

/**
 * Internal dependencies
 */
import { AI_PROVIDERS } from "../constants";
import type { AIProviderId, SettingsPayload } from "../types";

import { ProviderCard } from "./ProviderCard";
import { ProviderConfigForm } from "./ProviderConfigForm";

interface AIConfigurationTabProps {
    settings: SettingsPayload;
    saving: boolean;
    onSave: (patch: Partial<SettingsPayload>) => Promise<boolean>;
}

export function AIConfigurationTab({
    settings,
    saving,
    onSave,
}: AIConfigurationTabProps) {
    const storedId = settings.ai_active_provider;
    const initialId: AIProviderId | null =
        storedId && AI_PROVIDERS.some((p) => p.id === storedId)
            ? (storedId as AIProviderId)
            : null;

    const [selectedId, setSelectedId] = useState<AIProviderId | null>(
        initialId,
    );

    useEffect(() => {
        if (initialId && selectedId === null) {
            setSelectedId(initialId);
        }
    }, [initialId, selectedId]);

    const selectedProvider = useMemo(
        () => AI_PROVIDERS.find((p) => p.id === selectedId) ?? null,
        [selectedId],
    );

    return (
        <div className="space-y-5">
            <div className="rounded-xl border border-(--opt-border) bg-white overflow-hidden">
                <div className="flex items-center gap-5 px-5 py-4 border-b border-(--opt-border) bg-slate-50/60">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white border border-(--opt-border) text-indigo-500 shadow-sm">
                        <BotIcon size={18} />
                    </div>
                    <div>
                        <p className="font-semibold text-(--opt-text-default) mt-0 mb-2.5 leading-tight" style={{ fontSize: "18px", margin: 0 }}>
                            {__("AI Provider", "optiontics")}
                        </p>
                        <p className="text-xs text-(--opt-text-tertiary) m-0!">
                            {__("Choose your preferred AI model provider", "optiontics")}
                        </p>
                    </div>
                </div>

                <div
                    role="radiogroup"
                    aria-label={__("AI Provider", "optiontics")}
                    className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 p-5"
                >
                    {AI_PROVIDERS.map((p) => (
                        <ProviderCard
                            key={p.id}
                            provider={p}
                            selected={selectedId === p.id}
                            onSelect={setSelectedId}
                        />
                    ))}
                </div>
            </div>

            {selectedProvider && (
                <div className="rounded-xl border border-(--opt-border) bg-white overflow-hidden">
                    <div className="flex items-center gap-5 px-5 py-4 border-b border-(--opt-border) bg-slate-50/60">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white border border-(--opt-border) text-indigo-500 shadow-sm">
                            <KeyRoundIcon size={18} />
                        </div>
                        <div>
                            <p className="font-semibold text-(--opt-text-default) mt-0 mb-2.5 leading-tight" style={{ fontSize: "18px", margin: 0 }}>
                                {__("Configuration", "optiontics")}
                            </p>
                            <p className="text-xs text-(--opt-text-tertiary) m-0!">
                                {selectedProvider.name}
                            </p>
                        </div>
                    </div>
                    <div className="p-5">
                        <ProviderConfigForm
                            provider={selectedProvider}
                            settings={settings}
                            saving={saving}
                            onSave={onSave}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
