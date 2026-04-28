/**
 * Wordpress dependencies
 */
import { __ } from "@wordpress/i18n";

/**
 * Internal dependencies
 */
import Component from "./Component";
import Controls from "./Controls";
import { NumberBlockIcon } from "@/common/icons";

export const settings = {
    title: __("Number", "optiontics"),
    icon: <NumberBlockIcon />,
    tags: ["number", "input"],
    category: "general",
    component: Component,
    controls: Controls,
    attributes: {
        displayName: __("Number", "optiontics"),
        type: "number",
        label: __("Number", "optiontics"),
        desc: "",
        placeholder: __("Write Something...", "optiontics"),
        pricePosition: "with_title",
        required: false,
        min: 0,
        max: 100,
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
