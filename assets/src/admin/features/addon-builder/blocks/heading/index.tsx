/**
 * Wordpress dependencies
 */
import { __ } from "@wordpress/i18n";

/**
 * Internal dependencies
 */
import Component from './Component';
import Controls from './Controls';
import { HeadingBlockIcon } from "@/common/icons";

export const settings = {
	title: __("Heading", "optiontics"),
	icon: <HeadingBlockIcon />,
	tags: [ __("heading", "optiontics") ],
	category: __("general", "optiontics"),
	component: Component,
	controls: Controls,
	attributes: {
		displayName: __("Heading", "optiontics"),
		type: "heading",
		hide: false,
		required: false,
		tag: "h1",
		value: "Heading Example",
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
