/**
 * WordPress dependencies
 */
import { useEffect, useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";

/**
 * Internal dependencies
 */
import { Container, PageHeader } from "@/common/components";
import { Skeleton } from "@/shadcn/components/ui/skeleton";

import { AIConfigurationTab } from "./components/AIConfigurationTab";
import { IntegrationsTab } from "./components/IntegrationsTab";
import { SettingsSidebar } from "./components/SettingsSidebar";
import {
    useSettingsApi,
    useSettingsState,
} from "./store/useSettings";
import type { SettingsTabId } from "./types";

const SettingsPage = () => {
    const [activeTab, setActiveTab] = useState<SettingsTabId>("ai");
    const { data: settings, loading, saving, initialized } = useSettingsState();
    const { fetchSettings, saveSettings: save } = useSettingsApi();

    useEffect(() => {
        if (!initialized) {
            fetchSettings();
        }
    }, [initialized]);

    return (
        <>
            <PageHeader title={__("Settings", "optiontics")} />
            <Container>
                <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 pb-10 md:flex-row md:px-8">
                    <SettingsSidebar
                        active={activeTab}
                        onChange={setActiveTab}
                    />

                    <section className="flex-1 min-w-0">
                        {loading ? (
                            <div className="space-y-4">
                                <Skeleton className="h-[180px] w-full rounded-xl" />
                                <Skeleton className="h-[72px] w-full rounded-xl" />
                                <Skeleton className="h-[72px] w-full rounded-xl" />
                            </div>
                        ) : (
                            <div
                                key={activeTab}
                                className="animate-in fade-in slide-in-from-bottom-2 duration-200"
                            >
                                {activeTab === "ai" ? (
                                    <AIConfigurationTab
                                        settings={settings}
                                        saving={saving}
                                        onSave={save}
                                    />
                                ) : (
                                    <IntegrationsTab />
                                )}
                            </div>
                        )}
                    </section>
                </div>
            </Container>
        </>
    );
};

export default SettingsPage;
