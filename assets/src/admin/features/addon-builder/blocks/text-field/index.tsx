/**
 * Wordpress dependencies
 */
import { __ } from "@wordpress/i18n";

/**
 * Internal dependencies
 */
import Component from "./Component";
import Controls from "./Controls";
import { TextblockIcon } from "@/common/icons";

export const settings = {
	title: __("Text Field", "optiontics"),
	icon: <TextblockIcon />,
	tags: ["text", "paragraph", "input"],
	category: "general",
	component: Component,
	controls: Controls,
	attributes: {
		displayName: __("Text Field", "optiontics"),
		type: "textfield",
		label: __("Text Field", "optiontics"),
		desc: "",
		placeholder: __("Write Something...", "optiontics"),
		pricePosition: "with_title",
		required: false,
		options: [
			{
				type: "fixed",
				regular: "2",
				sale: "",
			},
		],
		class: "",
		id: "",
		_styles: {
			height: {
				val: 32,
			},
			width: {
				val: 32,
			},
			radius: {
				val: 4,
			},
			mrR: {
				val: 8,
			},
		},
		en_logic: false,
        fieldConditions: {
            condition: {
                visibility: "",
                match: "",
            },
            rules: [
                {
                    field: "",
                    compare: "",
                    value: "",
                },
            ],
        },
	},
};
