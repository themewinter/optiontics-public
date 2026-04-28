import { __ } from "@wordpress/i18n";
import { Status } from "./Status";
import { Action } from "./Action";
import { ADDON_LIST_OPTIONS } from "../../../constant";
import Title from "./Title";
import type { TableColumn } from "@/common/components/table";

function HeaderLabel({ text }: { text: string }) {
	return (
		<span
			className="text-sm font-medium tracking-wide whitespace-nowrap"
			style={{ color: "var(--opt-text-secondary)" }}
		>
			{text}
		</span>
	);
}

export const columns: TableColumn[] = [
	{
		key: "title",
		title: <HeaderLabel text={__("Title", "optiontics")} />,
		dataIndex: "title",
		width: 280,
		render: (_: any, record: any) => <Title record={record} />,
	},
	{
		key: "product_type",
		title: <HeaderLabel text={__("Product conditions", "optiontics")} />,
		dataIndex: "product_type",
		width: 150,
		render: (_: any, record: any) => {
			const label =
				ADDON_LIST_OPTIONS.find(
					(option) => option.value === record?.product_type,
				)?.label || __("All Products", "optiontics");
			return (
				<span
					className="inline-flex items-center gap-1.5 rounded-full px-3 py-[5px] text-xs font-medium whitespace-nowrap"
					style={{ backgroundColor: "#e8f1ff", color: "#3b82f6" }}
				>
					<span
						className="shrink-0 rounded-full"
						style={{ width: 6, height: 6, backgroundColor: "#3b82f6" }}
					/>
					{label}
				</span>
			);
		},
	},
	{
		key: "fields",
		title: <HeaderLabel text={__("Options", "optiontics")} />,
		dataIndex: "fields",
		width: 130,
		render: (fields: any[]) => (
			<span
				className="text-sm font-[510]"
				style={{ color: "var(--opt-text-default)" }}
			>
				{fields?.length || 0} {__("Options", "optiontics")}
			</span>
		),
	},
	{
		key: "status",
		title: <HeaderLabel text={__("Status", "optiontics")} />,
		dataIndex: "status",
		width: 100,
		render: (_value: any, record: any) => <Status record={record} />,
	},
	{
		key: "action",
		title: "",
		dataIndex: "action",
		width: 120,
		align: "right",
		render: (_value: any, record: any) => <Action record={record} />,
	},
];
