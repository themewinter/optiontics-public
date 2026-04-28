/**
 * WordPress Dependencies
 */
import { createReduxStore, register } from "@wordpress/data";

/**
 * Internal dependencies
 */
import { stores } from "@/globalConstant";
import { initialState, TemplatesState } from "./types";

// Action types
const actionTypes = {
    UPDATE_STATE: "UPDATE_STATE",
};

// Create the store
const store = createReduxStore(stores.templates, {
    // Reducer to handle state updates
    reducer: (state = initialState, action) => {
        switch (action.type) {
            case actionTypes.UPDATE_STATE:
                return { ...state, ...action.payload };
            default:
                return state;
        }
    },

    // Actions for dispatching updates
    actions: {
        setTemplatesState(updates: Partial<TemplatesState>) {
            return { type: actionTypes.UPDATE_STATE, payload: updates };
        },
    },

    // Selectors for accessing state
    selectors: {
        getTemplatesState(
            state: TemplatesState,
            key?: keyof TemplatesState,
        ) {
            return key ? state[key] : state;
        },
    },
});

// Register the store
register(store);

// Export actions for use in components
export const actions = store.actions;
export const selectors = store.selectors;
export default store;