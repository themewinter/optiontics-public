/**
 * WordPress Dependencies
 */
import { createReduxStore, register } from "@wordpress/data";

/**
 * Internal dependencies
 */
import { pagination, stores } from "@/globalConstant";
import { AddonBuilderState } from "./types";

// Initial state for the store
const initialState: AddonBuilderState = {
    collapsed: false,
    themeColor: "#000000",
    title: "Untitled Option",
    category: "",
    isEditingTitle: false,
    isEditingCategory: false,
    isFiltering: false,
    singleOption: null,
    error: null,
    activeTab: "general",
    activeTabContent: null,
    addonList: [],
    selectedProductType: null,
    selectedProduct: null,
    excludedProducts: null,
    selectedCategory: null,
    total: 0,
    searchQuery: {
        paged: pagination?.paged,
        per_page: pagination?.per_page,
        search: "",
    },
    updatingOption: null,
    needsRevalidation: false,
    productSelectionModal: false,
    products: [],
    categories: [],
    craftData: JSON.stringify({
        ROOT: {
            type: {
                resolvedName: "body",
            },
            isCanvas: true,
            props: {
                displayName: "Body",
                background: "#ffffff",
                color: "#000000",
                minHeight: "100px",
                minWidth: "300px",
                width: {
                    size: 100,
                    unit: "%",
                },
                padding: {
                    top: 15,
                    right: 15,
                    bottom: 15,
                    left: 15,
                    isLinked: false,
                    unit: "px",
                },
            },
            displayName: "Body",
            hidden: false,
            nodes: [],
            linkedNodes: {},
        },
    }),
};

// Action types
const actionTypes = {
    UPDATE_STATE: "UPDATE_STATE",
};

// Create the store
const store = createReduxStore(stores?.addons, {
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
        setAddonBuilderState(updates: Partial<AddonBuilderState>) {
            return { type: actionTypes.UPDATE_STATE, payload: updates };
        },
    },

    // Selectors for accessing state
    selectors: {
        getAddonBuilderState(
            state: AddonBuilderState,
            key?: keyof AddonBuilderState,
        ) {
            return key ? state[key] : state;
        },
    },
});

// Register the store
register(store);
