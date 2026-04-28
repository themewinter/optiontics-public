/**
 * WordPress Dependencies
 */
import { createReduxStore, register } from "@wordpress/data";

/**
 * Internal dependencies
 */
import { stores } from "@/globalConstant";
import { initialState, SettingsState } from "./types";

const actionTypes = {
    UPDATE_STATE: "UPDATE_STATE",
};

const store = createReduxStore(stores.settings, {
    reducer: (state = initialState, action) => {
        switch (action.type) {
            case actionTypes.UPDATE_STATE:
                return { ...state, ...action.payload };
            default:
                return state;
        }
    },

    actions: {
        setSettingsState(updates: Partial<SettingsState>) {
            return { type: actionTypes.UPDATE_STATE, payload: updates };
        },
    },

    selectors: {
        getSettingsState(
            state: SettingsState,
            key?: keyof SettingsState,
        ) {
            return key ? state[key] : state;
        },
    },
});

register(store);

export const actions = store.actions;
export const selectors = store.selectors;
export default store;
