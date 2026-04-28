/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";

/**
 * Internal dependencies
 */
import { Tabs, TabsList, TabsTrigger } from "@/shadcn/components/ui/tabs";
import { Control, ControlGeneratorProps } from "../../types";

type SelectionValue = "single" | "multiple";

/**
 * Selection-mode picker (Single / Multiple).
 *
 * Rendered as a shadcn Tabs control (no panels) so the pill-segmented look
 * and a11y come straight from Radix — no custom toggle markup.
 */
export default function SelectionModeControl({
	attrKey,
	control,
	attributes,
	setAttribute,
}: ControlGeneratorProps<any> & { control: Control }): React.ReactElement {
	const key = attrKey as string;
	const current = ((attributes[key] as SelectionValue) ?? "single") as SelectionValue;

	return (
		<div className="flex flex-col gap-2">
			<span className="text-sm font-medium text-gray-700">
				{(control.label as string) ?? __("Selection mode", "optiontics")}
			</span>
			<Tabs
				value={current}
				onValueChange={(next) => setAttribute(key, next as SelectionValue)}
			>
				<TabsList className="w-full h-10">
					<TabsTrigger value="single" className="flex-1">
						{__("Single", "optiontics")}
					</TabsTrigger>
					<TabsTrigger value="multiple" className="flex-1">
						{__("Multiple", "optiontics")}
					</TabsTrigger>
				</TabsList>
			</Tabs>
		</div>
	);
}
