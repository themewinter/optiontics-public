import type { SettingsPayload } from "../types";

export interface SettingsState {
    data: SettingsPayload;
    loading: boolean;
    saving: boolean;
    initialized: boolean;
}

export const initialState: SettingsState = {
    data: {},
    loading: true,
    saving: false,
    initialized: false,
};
