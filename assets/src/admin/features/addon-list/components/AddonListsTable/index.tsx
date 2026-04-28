/**
 * WordPress dependencies
 */
import { useSelect } from "@wordpress/data";
import { __ } from "@wordpress/i18n";
import { useState } from "@wordpress/element";

/**
 * Internal dependencies
 */
import { stores } from "@/globalConstant";
import { columns } from "./Columns";
import useBuilderApi from "../../../addon-builder/hooks/useBuilderApi";
import { Table } from "@/common/components/table";
import { AddonListsToolbar } from "./AddonListsToolbar";
import { Pagination } from "@/common/components/table/Pagination";

export const AddonListsTable = () => {
	const { addonList, isFiltering, searchQuery: storeQuery, total } = useSelect(
		(select: any) => select(stores?.addons).getAddonBuilderState(),
		[],
	);
	const { getAddonLists, bulkDeleteOptions } = useBuilderApi();
	const [selectedIds, setSelectedIds] = useState<React.Key[]>([]);
	const [searchValue, setSearchValue] = useState("");
	const [filterValue, setFilterValue] = useState("all");

	const currentPage: number = storeQuery?.paged ?? 1;
	const itemsPerPage: number = storeQuery?.per_page ?? 10;
	const totalItems: number = total ?? 0;
	const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

	function handleFilterChange(value: string) {
		setFilterValue(value);
		const status = value === "all" ? "" : value;
		getAddonLists({ status, paged: 1 });
	}

	async function handleBulkDelete() {
		await bulkDeleteOptions(selectedIds.map(Number));
		setSelectedIds([]);
	}

	function handleSearch(value: string) {
		setSearchValue(value);
		getAddonLists({ search: value, resetFilter: true });
	}

	function handlePageChange(page: number) {
		getAddonLists({ paged: page });
	}

	function handlePerPageChange(perPage: number) {
		getAddonLists({ per_page: perPage, paged: 1 });
	}

	return (
		<div className="px-8 space-y-4">
			{/* Toolbar */}
			<div
				className="rounded-[6px] border border-[var(--opt-border)] bg-[var(--opt-white)] px-5 py-4"
			>
				<AddonListsToolbar
					searchValue={searchValue}
					onSearch={handleSearch}
					filterValue={filterValue}
					onFilterChange={handleFilterChange}
					selectedCount={selectedIds.length}
					onBulkDelete={handleBulkDelete}
				/>
			</div>

			{/* Table */}
			<Table
				dataSource={addonList ?? []}
				columns={columns}
				rowKey="id"
				loading={isFiltering}
				rowSelection={{
					type: "checkbox",
					showSelectAll: true,
					selectedRowKeys: selectedIds,
					onChange: (keys) => setSelectedIds(keys),
				}}
				emptyText={__("No data available", "optiontics")}
				size="large"
				rowClassName={() => "h-16"}
			/>

			{/* Pagination */}
			<Pagination
				currentPage={currentPage}
				totalPages={totalPages}
				totalItems={totalItems}
				itemsPerPage={itemsPerPage}
				onPageChange={handlePageChange}
				onItemsPerPageChange={handlePerPageChange}
			/>
		</div>
	);
};
