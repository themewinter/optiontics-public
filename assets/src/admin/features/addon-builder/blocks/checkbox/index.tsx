/**
 * Wordpress dependencies
 */
import { __ } from "@wordpress/i18n";

/**
 * Internal dependencies
*/
import Component from "./Component";
import Controls from "./Controls";
import { CheckboxBlockIcon } from "@/common/icons";

export const settings = {
	title: __('Checkbox', 'optiontics'),
	icon: <CheckboxBlockIcon />,
	tags: [__('checkbox', 'optiontics'), __('options', 'optiontics')],
	category: __('general', 'optiontics'),
	component: Component,
	controls: Controls,
	attributes: {
		displayName: __('Checkbox', 'optiontics'),
		type:"checkbox",
		label: __('Checkbox', 'optiontics'),
		desc: "",
		hide: false,
		required: false,
		isQuantity: false,
		min: 1,
		max: 100,
		columns: 1,
		options: [
			{
				value: 'Option 1 checkbox',
				type: 'fixed',
				regular: '84',
				sale: '50',
				default: false,
				image: '',
			},
			{
				value: 'Option 2 checkbox',
				type: 'fixed',
				regular: '50',
				sale: '',
				default: true,
				image: '',
			},
			{
				value: 'Option 3 checkbox',
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


