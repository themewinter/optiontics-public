/**
 * WordPress dependencies
 */
import { useDispatch, useSelect } from "@wordpress/data";

/**
 * Internal dependencies
 */
import { SearchInput } from "@/common/components/form";
import { stores } from "@/globalConstant";

/**
 * SearchBar component for filtering blocks in the BlockSidebar.
 * Provides real-time search functionality with debounced input handling.
 */
export const SearchBar = () => {
    const state = useSelect((select) =>
        select(stores?.addons).getAddonBuilderState(),
    );
    const { setAddonBuilderState } = useDispatch(stores?.addons);

    const { searchQuery } = state || {};
    const handleSearchChange = (query: { search: string }) => {
        setAddonBuilderState({
            searchQuery: {
                ...searchQuery,
                search: query.search,
            },
        });
    };

    return (
        <div className="relative mb-4">
            <SearchInput
                value={searchQuery?.search || ""}
                searchFunc={async (query: { search: string }) => {
                    handleSearchChange(query);
                    return { complete: true };
                }}
                placeholder="Search blocks..."
            />
        </div>
    );
};
