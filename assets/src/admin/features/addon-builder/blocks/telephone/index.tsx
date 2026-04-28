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
	title: __("Telephone", "optiontics"),
	icon: <TextblockIcon />,
	tags: ["telephone", "input"],
	category: "general",
	component: Component,
	controls: Controls,
	attributes: {
		displayName: __("Telephone", "optiontics"),
		type: "telephone",
		label: __("Telephone", "optiontics"),
		desc: "",
		placeholder: __("XXXXXXXXXX", "optiontics"),
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
