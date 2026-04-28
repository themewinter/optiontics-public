/**
 * WordPress Dependencies
 */
import { select, useDispatch, useSelect } from "@wordpress/data";

/**
 * External dependencies
 */
import { useParams } from "react-router-dom";

/**
 * Internal dependencies
 */
import { pagination, stores } from "@/globalConstant";
import { craftJsToBackend } from "../utils";
import Api from "@/api";
import { AddonListSearchQuery } from "../store/types";

/**
 * Custom hook for managing option-related API operations in WordPress.
 * Provides functions to create, update, fetch, duplicate, and delete options.
 */
function useBuilderApi() {
    const { id } = useParams();

    const { setAddonBuilderState } = useDispatch(stores?.addons);

    const { searchQuery } = useSelect((select: any) =>
        select(stores?.addons).getAddonBuilderState(),
    );

    /**
     * Gets a single option by ID and updates the state
     */
    const getSingleOption = async () => {
        try {
            setAddonBuilderState({ isFiltering: true, error: null });

            const res = await Api?.addons?.getSingleOption(Number(id));
            if (res?.success) {

                setAddonBuilderState({
                    singleOption: res?.data,
                    isFiltering: false,
                    title: res?.data?.title,
                });
                return res?.data;
            }
        } catch (error) {
            console.error("Error fetching single option:", error);
            setAddonBuilderState({
                error: "Failed to fetch option",
                isFiltering: false,
            });
        } finally {
            setAddonBuilderState({ isFiltering: false });
        }
    };

    /**
     * Saves option data with Craft.js format conversion
     */
    const saveOption = async (craftData: any) => {
        try {
            setAddonBuilderState({ isFiltering: true, error: null });

            // Convert Craft.js format to backend format
            const fields = craftJsToBackend(craftData);

            const res = await Api?.addons?.updateOption(Number(id), { fields });

            if (res?.success) {
                setAddonBuilderState({
                    isFiltering: false,
                    needsRevalidation: true,
                });
                return res?.data;
            }
        } catch (error) {
            console.error("Error saving option:", error);
            setAddonBuilderState({
                error: "Failed to save option",
                isFiltering: false,
            });
        } finally {
            setAddonBuilderState({ isFiltering: false });
        }
    };

    /**
     * Creates a new option with Craft.js format conversion
     */
    const createOption = async (craftData: any, optionData: any) => {
        try {
            setAddonBuilderState({ isFiltering: true, error: null });

            // Convert Craft.js format to backend format
            const fields = craftJsToBackend(craftData);

            const res = await Api?.addons?.createOption({
                ...optionData,
                fields,
            });

            if (res?.success) {
                setAddonBuilderState({
                    isFiltering: false,
                    needsRevalidation: true,
                });
                return res?.data;
            }
        } catch (error) {
            console.error("Error creating option:", error);
            setAddonBuilderState({
                error: "Failed to create option",
                isFiltering: false,
            });
        } finally {
            setAddonBuilderState({ isFiltering: false });
        }
    };

    /**
     * Fetches addon lists based on a search query and pagination.
     */
    const getAddonLists = async (
        query: Partial<AddonListSearchQuery & { resetFilter?: boolean }> = {},
    ) => {
        // Handle reset filter case
        let params;
        if (query?.resetFilter) {
            params = {
                paged: pagination?.paged,
                per_page: pagination?.per_page,
                search: query?.search ?? searchQuery?.search,
            };
        } else {
            // Only merge queries for non-reset cases
            params = { ...searchQuery, ...query };
        }

        setAddonBuilderState({ isFiltering: true, error: null });

        try {
            // Call API to get all addon lists
            const res = await Api?.addons?.getOptions(params);
            if (res?.success) {
                setAddonBuilderState({
                    addonList: res?.data?.items || [],
                    total: res?.data?.total || 0,
                    needsRevalidation: false,
                    searchQuery: {
                        ...params,
                        paged: res?.data?.current_page || params.paged || 1,
                    },
                });
            }
        } catch (error) {
            console.error("Error fetching addon lists:", error);
            setAddonBuilderState({
                error: "Failed to fetch addon lists",
                isFiltering: false,
            });
        } finally {
            setAddonBuilderState({ isFiltering: false });
        }
    };

    /**
     * Updates an existing option
     */
    const updateOption = async (id: number, payload: any) => {
        try {
            setAddonBuilderState({
                updatingOption: id,
                error: null,
            });

            const res = await Api?.addons?.updateOption(id, payload);

            if (res?.success) {
                // Get latest addon list from store
                const { addonList } = select(
                    stores?.addons,
                ).getAddonBuilderState();

                // Update the addon in the list (only if list is loaded)
                const updatedList = addonList?.map((addon: any) =>
                    addon.id === res?.data?.id ? res?.data : addon,
                );

                setAddonBuilderState({
                    addonList: updatedList,
                    needsRevalidation: true,
                    // Always update singleOption directly from response — never derive
                    // from addonList which may be empty on the builder page
                    singleOption: res?.data,
                });
                return res;
            }
            return res;
        } catch (error) {
            console.error("Error updating addon:", error);
            setAddonBuilderState({
                error: "Failed to update addon",
            });
            throw error;
        } finally {
            setAddonBuilderState({ updatingOption: null });
        }
    };

    /**
     * Fetches products based on a search query and pagination.
     */
    const getProducts = async (params: Record<string, any> = {}) => {
        setAddonBuilderState({ isFiltering: true, error: null });
        try {
            // Call API to get all products
            const res = await Api?.products?.getProducts(params);
            if (res?.success) {
                setAddonBuilderState({
                    products: res?.data || [],
                });
            }
        } catch (error) {
            console.error("Error fetching products:", error);
            setAddonBuilderState({
                error: "Failed to fetch products",
                isFiltering: false,
            });
        } finally {
            setAddonBuilderState({ isFiltering: false });
        }
    };
    /**
     * Deletes an option
     */
    const deleteOption = async (id: number) => {
        try {
            setAddonBuilderState({error: null });
            const res = await Api?.addons?.deleteOption(id);
            if (res?.success) {
                // Get latest addon list from store
                const { addonList } = select(
                    stores?.addons,
                ).getAddonBuilderState();

                // Update the addon in the list
                const updatedList = addonList?.filter((addon: any) => addon.id !== id);

                // Update the state
                setAddonBuilderState({ addonList: updatedList });
            }
            return res;
        } catch (error) {
            console.error("Error deleting option:", error);
            setAddonBuilderState({
                error: "Failed to delete option",
            });
        }
    };

    /**
     * Clones an existing option and refreshes the list so the new draft
     * shows up in the table immediately.
     */
    const cloneOption = async (id: number) => {
        try {
            setAddonBuilderState({ updatingOption: id, error: null });
            const res = await Api?.addons?.cloneOption(id);
            if (res?.success) {
                await getAddonLists();
            }
            return res;
        } catch (error) {
            console.error("Error cloning option:", error);
            setAddonBuilderState({ error: "Failed to clone option" });
        } finally {
            setAddonBuilderState({ updatingOption: null });
        }
    };

    /**
     * Bulk deletes multiple options by ID and refreshes the list
     */
    const bulkDeleteOptions = async (ids: number[]) => {
        try {
            setAddonBuilderState({ error: null });
            const res = await Api?.addons?.bulkDeleteOptions(ids);
            if (res?.success) {
                await getAddonLists();
            }
            return res;
        } catch (error) {
            console.error("Error bulk deleting options:", error);
            setAddonBuilderState({ error: "Failed to delete options" });
        }
    };

    /**
     * Fetches products based on a search query and pagination.
     */
    const getCategories = async (params: Record<string, any> = {}) => {
        setAddonBuilderState({ isFiltering: true, error: null });
        try {
            // Call API to get all products
            const res = await Api?.products?.getCategories(params);
            if (res?.success) {
                setAddonBuilderState({
                    categories: res?.data || [],
                });
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
            setAddonBuilderState({
                error: "Failed to fetch categories",
                isFiltering: false,
            });
        } finally {
            setAddonBuilderState({ isFiltering: false });
        }
    };

    // Return an object containing all option API functions and state
    return {
        // API Functions
        getSingleOption,
        getAddonLists,
        updateOption,
        saveOption,
        createOption,
        getProducts,
        getCategories,
        deleteOption,
        cloneOption,
        bulkDeleteOptions,
        // Conversion functions
        craftJsToBackend,
    };
}

export default useBuilderApi;
