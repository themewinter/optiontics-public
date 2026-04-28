/**
 * WordPress dependencies
 */
import { ReactElement } from "@wordpress/element";
import { __ } from "@wordpress/i18n";

/**
 * External dependencies
 */
import { GripVertical, Image as ImageIcon, X } from "lucide-react";

/**
 * Internal dependencies
 */
import {
	Input,
	SelectValue,
	SelectTrigger,
	Select,
	SelectItem,
	SelectContent,
} from "@/shadcn/components/ui";
import { Button } from "@/shadcn/components/ui/button";
import { If, ProBadgeIcon } from "@/common/components";
import type { Option } from "./types";
import { priceTypeOptions } from "../../../constant";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/shadcn/components/ui/input-group";
import { CloseIcon } from "@/common/icons";


interface Props {
	option: Option;
	index: number;
	dragging: boolean;
	over: boolean;
	onDragStart: (index: number, e: React.DragEvent) => void;
	onDragOver: (e: React.DragEvent, index: number) => void;
	onDragEnd: () => void;
	onDrop: (index: number, e: React.DragEvent) => void;
	updateOption: (index: number, field: keyof Option, value: any) => void;
	updateOptionFields: (index: number, updates: Partial<Option>) => void;
	toggleDefault: (index: number) => void;
	deleteOption: (index: number) => void;
	uploadImage: (
		event: React.MouseEvent<HTMLElement, MouseEvent>,
		index: number
	) => void;
	removeImage: (index: number) => void;
	blockType?: string;
	showSalePrice?: boolean;
	imageEnabled?: boolean;
}

/**
 * Presentational: a single row with fields, drag handle, and actions.
 * Shared across all option-based blocks (Radio, Dropdown, etc.)
 */
export default function OptionRow({
	option,
	index,
	dragging,
	over,
	onDragStart,
	onDragOver,
	onDragEnd,
	onDrop,
	updateOption,
	updateOptionFields,
	toggleDefault,
	deleteOption,
	uploadImage,
	removeImage,
	blockType,
	showSalePrice = true,
	imageEnabled = false,
}: Props): ReactElement {
	const isCheckbox = blockType === "checkbox";
	const imageLocked = !imageEnabled;

	return (
		<div
			className={`opt-option-row grid grid-cols-[20px_40px_1fr_120px_180px_40px] gap-2 items-center p-2 rounded-md transition-colors ${
				dragging
					? "bg-gray-50 ring-1 ring-primary/40 shadow-sm"
					: over
					? "bg-gray-100"
					: ""
			}`}
			onDragOver={(e) => onDragOver(e, index)}
			onDrop={(e) => onDrop(index, e)}
		>
			{/* Drag handle */}
			<div
				className="flex items-center justify-center cursor-move"
				draggable
				onDragStart={(e) => onDragStart(index, e)}
				onDragEnd={onDragEnd}
			>
				<GripVertical className="w-4 h-4 text-gray-400" />
			</div>

			{/* Image — cell always rendered to preserve the grid layout; for
			    block types without an image picker the cell is intentionally empty. */}
			<div
				className={`flex items-center justify-center w-10 relative`}
				title={
					imageLocked
						? __("This feature is not currently available.", "optiontics")
						: undefined
				}
			>
				<If condition={blockType !== "button" && blockType !== "button_group"}>
					<If condition={option.image}>
						<div className="relative">
							<img
								src={option.image}
								alt={option.value}
								className="rounded-full size-10 opt-option-image"
							/>
							<If condition={!imageLocked}>
								<X
									className="w-4 h-4 cursor-pointer absolute top-0 right-0 bg-red-400 text-white rounded-full p-0.5"
									onClick={() => removeImage(index)}
								/>
							</If>
						</div>
					</If>
					<If condition={!option.image}>
						<Button
							size="icon"
							variant="outline"
							className={`opt-option-image-upload-btn w-10 h-10 rounded-full border-0! bg-[#F7F8FA]! hover:bg-[#F7F8FA]! ${
								imageLocked ? "pointer-events-none" : ""
							}`}
							onClick={(e) => {
								if (imageLocked) return;
								uploadImage(e, index);
							}}
							aria-disabled={imageLocked}
						>
							<ImageIcon className="w-4 h-4 text-gray-400" />
						</Button>
					</If>
					<If condition={imageLocked}>
                        <ProBadgeIcon className="absolute -top-2 left-0" />
					</If>
				</If>
			</div>

			{/* Title */}
			<InputGroup className="rounded! border border-gray-300!">
				<InputGroupInput
					value={option.value}
					onChange={(e) => updateOption(index, "value", e.target.value)}
					className="h-9 text-sm w-full"
				/>
				<InputGroupAddon align="inline-end">
					{/* Default */}
					<div className="flex items-center justify-center">
						<If condition={isCheckbox}>
							<button
								onClick={() => toggleDefault(index)}
								className={`opt-input-addon-checkbox w-5 h-5 rounded border-2 transition-colors ${
									option.default
										? "active bg-primary border-primary"
										: "bg-white border-gray-300"
								}`}
								role="checkbox"
								aria-checked={option.default}
							>
								{option.default && (
									<svg
										className="w-full h-full text-white"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
										strokeWidth={3}
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M5 13l4 4L19 7"
										/>
									</svg>
								)}
							</button>
						</If>
						<If condition={!isCheckbox}>
							<button
								onClick={() => toggleDefault(index)}
								className={`opt-input-grp-addon-radio w-5 h-5 rounded-full border-2 transition-colors ${
									option.default
										? "active bg-primary border-primary"
										: "bg-white border-gray-300"
								}`}
								role="radio"
								aria-checked={option.default}
							>
								{option.default && (
									<div className="opt-input-grp-addon-radio-inner w-full h-full rounded-full bg-white scale-50"></div>
								)}
							</button>
						</If>
					</div>
				</InputGroupAddon>
			</InputGroup>

			{/* Price Type */}
			<Select
				value={option.type}
				onValueChange={(value) => {
					if (value === "no_cost") {
						updateOptionFields(index, {
							type: value,
							regular: "Free",
							sale: "",
						});
					} else {
						updateOption(index, "type", value);
					}
				}}
			>
				<SelectTrigger className="h-9! text-sm rounded! border border-gray-300! w-full">
					<SelectValue placeholder={__("Select a price type", "optiontics")} />
				</SelectTrigger>
				<SelectContent>
					{priceTypeOptions.map((option) => (
						<SelectItem key={option.value} value={option.value}>
							{option.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>

			{/* Regular / Sale price */}
			<div className="flex items-center justify-center w-full border border-gray-300 rounded overflow-hidden opt-option-price-input">
				<Input
					value={option.type === "no_cost" ? "Free" : option.regular}
					onChange={(e) => {
						if (option.type !== "no_cost") {
							updateOption(index, "regular", e.target.value);
						}
					}}
					className={`h-9! text-sm w-full border-none! bg-transparent ${
						option.type === "no_cost" ? "cursor-not-allowed" : ""
					}`}
					placeholder="Regular"
					min={0}
					type={option.type === "no_cost" ? "text" : "number"}
					readOnly={option.type === "no_cost"}
				/>
				{showSalePrice && (
					<>
						<span className="text-gray-500 text-sm">/</span>
						<Input
							value={option.type === "no_cost" ? "" : option.sale}
							onChange={(e) => {
								if (option.type !== "no_cost") {
									updateOption(index, "sale", e.target.value);
								}
							}}
							className={`h-9! text-sm w-full border-0! bg-transparent ${
								option.type === "no_cost" ? "cursor-not-allowed" : ""
							}`}
							placeholder="Sale"
							min={0}
							type="number"
							readOnly={option.type === "no_cost"}
						/>
					</>
				)}
			</div>

			<div className="flex items-center justify-center w-full">
				{/* Delete */}
				<Button
					size="icon"
					variant="ghost"
					className="opt-option-delete-btn h-8 w-8"
					onClick={() => deleteOption(index)}
				>
					<CloseIcon />
				</Button>
			</div>
		</div>
	);
}
