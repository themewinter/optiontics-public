/**
 * WordPress dependencies
 */
import { useDispatch, useSelect } from "@wordpress/data";

/**
 * Internal dependencies
 */
import Api from "@/api";
import { stores } from "@/globalConstant";
import type { SettingsPayload } from "../types";
// Side-effect import — ensures the settings store is registered before any hook uses it.
import "./index";
import type { SettingsState } from "./types";

export function useSettingsApi() {
    const { setSettingsState } = useDispatch(stores.settings);

    const fetchSettings = async () => {
        setSettingsState({ loading: true });
        try {
            const res = await Api.settings.getSettings();
            const data = (res?.data ?? {}) as SettingsPayload;
            setSettingsState({ data, initialized: true });
        } catch {
            // ApiBase already toasted the error.
        } finally {
            setSettingsState({ loading: false });
        }
    };

    const saveSettings = async (
        patch: Partial<SettingsPayload>,
    ): Promise<boolean> => {
        setSettingsState({ saving: true });
        try {
            const res = await Api.settings.updateSettings(patch);
            if (res?.success) {
                const next = (res?.data ?? {}) as SettingsPayload;
                setSettingsState({ data: next, initialized: true });
                return true;
            }
            return false;
        } catch {
            return false;
        } finally {
            setSettingsState({ saving: false });
        }
    };

    return { fetchSettings, saveSettings };
}

export function useSettingsState(): SettingsState {
    return useSelect(
        (select: any) => select(stores.settings).getSettingsState(),
        [],
    );
}
