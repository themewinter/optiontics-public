/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";


/**
 * Optiontics Pagination component.
 *   All controls: border #CBD8EA, rounded-4px, h-36px.
 *   Current page box: 36×36px, border-color = opt-primary, text opt-primary.
 */
import { cn } from "@/shadcn/lib/utils";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/shadcn/components/ui/select";

export interface PaginationProps {
	currentPage: number;
	totalPages: number;
	totalItems: number;
	itemsPerPage: number;
	onPageChange: (page: number) => void;
	onItemsPerPageChange: (perPage: number) => void;
	className?: string;
}

const PER_PAGE_OPTIONS = [10, 20, 50];

export function Pagination({
	currentPage,
	totalPages,
	totalItems,
	itemsPerPage,
	onPageChange,
	onItemsPerPageChange,
	className,
}: PaginationProps) {
	const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
	const endItem = Math.min(currentPage * itemsPerPage, totalItems);

	const baseInput =
		"h-9 rounded-[4px] border border-[var(--opt-border)] bg-white text-sm text-[var(--opt-text-secondary)] outline-none";

	return (
		<div className={cn("flex items-center justify-between gap-4 flex-wrap", className)}>
			{/* ── Left: rows per page ── */}
			<div className="flex items-center gap-2">
				<span className="text-sm text-[var(--opt-text-secondary)] whitespace-nowrap">
					{__("Rows per page ", "optiontics")}
				</span>
				<Select
					value={String(itemsPerPage)}
					onValueChange={(val) => onItemsPerPageChange(Number(val))}
				>
					<SelectTrigger className={cn(baseInput, "w-[80px] cursor-pointer")}>
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{PER_PAGE_OPTIONS.map((n) => (
							<SelectItem key={n} value={String(n)}>
								{n}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			{/* ── Right: range + navigation ── */}
			<div className="flex items-center gap-2">
				<span className="text-sm text-[var(--opt-text-secondary)] whitespace-nowrap">
					{startItem}–{endItem} {__("of", "optiontics")} {totalItems}
				</span>

				{/* Previous */}
				<button
					onClick={() => onPageChange(currentPage - 1)}
					disabled={currentPage <= 1}
					className={cn(
						baseInput,
						"flex h-9 w-[93px] items-center justify-center gap-1 px-2 font-medium",
						"hover:bg-[var(--opt-secondary-soft)] transition-colors duration-150",
						"disabled:pointer-events-none disabled:opacity-40 cursor-pointer",
					)}
				>
					<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
						<path
							d="M10 12L6 8L10 4"
							stroke="var(--opt-text-secondary)"
							strokeWidth="1.4"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
					<span>{__("Previous", "optiontics")}</span>
				</button>

				{/* Current page number box */}
				<div
					className="flex size-9 items-center justify-center rounded-[4px] text-sm font-medium"
					style={{
						border: "1px solid var(--opt-primary)",
						color: "var(--opt-primary)",
					}}
				>
					{currentPage}
				</div>

				{/* Next */}
				<button
					onClick={() => onPageChange(currentPage + 1)}
					disabled={currentPage >= totalPages}
					className={cn(
						baseInput,
						"flex h-9 w-[93px] items-center justify-center gap-1 px-2 font-medium",
						"hover:bg-[var(--opt-secondary-soft)] transition-colors duration-150",
						"disabled:pointer-events-none disabled:opacity-40 cursor-pointer",
					)}
				>
					<span>{__("Next", "optiontics")}</span>
					<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
						<path
							d="M6 4L10 8L6 12"
							stroke="var(--opt-text-secondary)"
							strokeWidth="1.4"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
				</button>
			</div>
		</div>
	);
}
