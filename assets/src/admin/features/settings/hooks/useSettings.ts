/**
 * WordPress dependencies
 */
import { useEffect } from "@wordpress/element";

/**
 * Internal dependencies
 */
import type { SettingsPayload } from "../types";
import {
    useSettingsApi,
    useSettingsState,
} from "../store/useSettings";

interface UseSettingsResult {
    settings: SettingsPayload;
    loading: boolean;
    saving: boolean;
    save: (patch: Partial<SettingsPayload>) => Promise<boolean>;
    refresh: () => Promise<void>;
}

export function useSettings(): UseSettingsResult {
    const { fetchSettings, saveSettings } = useSettingsApi();
    const { data, loading, saving, initialized } = useSettingsState();

    useEffect(() => {
        if (!initialized) {
            fetchSettings();
        }
    }, [initialized]);

    return {
        settings: data,
        loading,
        saving,
        save: saveSettings,
        refresh: fetchSettings,
    };
}
