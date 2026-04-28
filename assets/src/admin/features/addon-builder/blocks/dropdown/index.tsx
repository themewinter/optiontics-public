/**
 * Wordpress dependencies
 */
import { __ } from "@wordpress/i18n";

/**
 * Internal dependencies
*/
import Component from "./Component";
import Controls from "./Controls";
import { DropdownSelectBlockIcon } from "@/common/icons";

export const settings = {
	title: __('Dropdown', 'optiontics'),
	icon: <DropdownSelectBlockIcon />,
	tags: [__('select', 'optiontics'), __('options', 'optiontics')],
	category: __('general', 'optiontics'),
	component: Component,
	controls: Controls,
	attributes: {
		displayName: __('Dropdown', 'optiontics'),
		type:"select",
		label: __('Dropdown', 'optiontics'),
		desc: "",
		hide: false,
		required: false,
		options: [
			{
				value: 'Option 1',
				type: 'fixed',
				regular: '84',
				sale: '50',
				default: false,
				image: '',
			},
			{
				value: 'Option 2',
				type: 'fixed',
				regular: '50',
				sale: '',
				default: true,
				image: '',
			},
			{
				value: 'Option 3',
				type: 'fixed',
				regular: '84',
				sale: '50',
				default: false,
				image: '',
			},
		],
		class: '',
		id: '',
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


