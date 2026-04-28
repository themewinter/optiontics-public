/**
 * WordPress dependencies
 */
import { useEffect, useRef } from "@wordpress/element";
import { useSelect } from "@wordpress/data";

/**
 * External dependencies
 */
import { useParams } from "react-router-dom";

/**
 * Internal dependencies
 */
import { stores } from "@/globalConstant";
import useBuilderApi from "./useBuilderApi";

/**
 * Hook to initialize builder data
 *
 * Fetches single option when page ID changes and updates store.
 * Also fetches addon lists on initial mount if needed.
 */
export const useBuilderInit = () => {
    const { id } = useParams<{ id: string }>();
    const { getSingleOption, getAddonLists } = useBuilderApi();
    const { singleOption, addonList } = useSelect(
        (select: any) => select(stores?.addons).getAddonBuilderState(),
        [],
    );

    // Track which ID has already been fetched to prevent duplicate API calls.
    // Using a ref (not state) avoids triggering re-renders and dependency cycles
    // caused by getSingleOption being recreated on every render (not memoized).
    const fetchedIdRef = useRef<string | undefined>(undefined);

    // Fetch single option when ID changes — dep array intentionally excludes
    // getSingleOption (recreated each render) to prevent duplicate calls.
    useEffect(() => {
        if (!id || fetchedIdRef.current === id) return;
        fetchedIdRef.current = id;
        getSingleOption();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    // Fetch addon lists only on initial mount if empty
    useEffect(() => {
        if (!addonList?.length) {
            getAddonLists();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return { singleOption };
};
