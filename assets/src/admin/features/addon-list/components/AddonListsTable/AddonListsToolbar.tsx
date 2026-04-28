/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";

/**
 * External dependencies
 */
import { Trash2 } from "lucide-react";

/**
 * Internal dependencies
 */
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/shadcn/components/ui/select";
import { SearchInput } from "@/common/components/form/SearchInput";
import { cn } from "@/shadcn/lib/utils";
import { DeleteConfirmationDialog } from "@/common/components/DeleteConfirmationDialog";

interface AddonListsToolbarProps {
	filterValue: string;
	onFilterChange: (value: string) => void;
	onSearch: (value: string) => void;
	searchValue: string;
	selectedCount: number;
	onBulkDelete: () => Promise<void>;
}

const filterOptions = [
	{ key: "all", label: __("All Options", "optiontics") },
	{ key: "publish", label: __("Active", "optiontics") },
	{ key: "draft", label: __("Draft", "optiontics") },
];

export function AddonListsToolbar({
	filterValue,
	onFilterChange,
	onSearch,
	searchValue,
	selectedCount,
	onBulkDelete,
}: AddonListsToolbarProps) {
	return (
		<div className="flex items-center justify-between flex-wrap gap-4">
			{/* Left: status filter + bulk delete */}
			<div className="flex items-center gap-2">
				<Select value={filterValue} onValueChange={onFilterChange}>
					<SelectTrigger
						size="sm"
						className={cn(
							"h-[36px] w-[150px] rounded-[4px] border-[var(--opt-border)] bg-white text-sm",
							"text-[var(--opt-text-tertiary)]",
							"focus-visible:border-[var(--opt-primary)] focus-visible:ring-[var(--opt-primary)]/20",
						)}
					>
						<SelectValue placeholder={__("Filter by status", "optiontics")} />
					</SelectTrigger>
					<SelectContent>
						{filterOptions.map((option) => (
							<SelectItem key={option.key} value={option.key}>
								{option.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				{selectedCount > 0 && (
					<DeleteConfirmationDialog
						onConfirm={onBulkDelete}
						title={__("Delete Selected Options", "optiontics")}
						description={__(
							`Are you sure you want to delete ${selectedCount} selected option${selectedCount > 1 ? "s" : ""}? This action cannot be undone.`,
							"optiontics",
						)}
						deleteBtnText={__("Delete", "optiontics")}
						trigger={
							<button
								type="button"
								className="inline-flex items-center gap-1.5 h-[36px] px-3 rounded-[4px] text-sm font-medium cursor-pointer transition-colors duration-150"
								style={{
									backgroundColor: "#fef2f2",
									color: "#dc2626",
									border: "1px solid #fecaca",
								}}
							>
								<Trash2 className="size-4" />
								{__("Delete", "optiontics")}
								<span
									className="inline-flex items-center justify-center rounded-full text-xs font-semibold px-1.5 min-w-[20px] h-5"
									style={{ backgroundColor: "#dc2626", color: "#fff" }}
								>
									{selectedCount}
								</span>
							</button>
						}
					/>
				)}
			</div>

			{/* Right: search */}
			<SearchInput
				value={searchValue}
				onSearch={onSearch}
				placeholder={__("Search...", "optiontics")}
				className="sm:w-full md:max-w-[240px]"
			/>
		</div>
	);
}
