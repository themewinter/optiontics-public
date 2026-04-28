/**
 * WordPress dependencies
 */
import { createReduxStore, register } from "@wordpress/data";

/**
 * Internal dependencies
 */
import { stores } from "@/globalConstant";

const initialState = {
    data: null as any[] | null,
    loading: false,
};

const actionTypes = {
    UPDATE_STATE: "UPDATE_STATE",
} as const;

const store = createReduxStore(stores.extensions, {
    reducer: (state = initialState, action: any) => {
        switch (action.type) {
            case actionTypes.UPDATE_STATE:
                return { ...state, ...action.payload };
            default:
                return state;
        }
    },

    actions: {
        setExtensionsState(updates: Partial<typeof initialState>) {
            return { type: actionTypes.UPDATE_STATE, payload: updates };
        },
    },

    selectors: {
        getExtensionsState(
            state: typeof initialState,
            key?: keyof typeof initialState,
        ) {
            return key ? state[key] : state;
        },
    },
});

register(store);
