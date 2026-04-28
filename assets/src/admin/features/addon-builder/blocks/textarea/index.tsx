/**
 * Wordpress dependencies
 */
import { __ } from "@wordpress/i18n";

/**
 * Internal dependencies
 */
import Component from "./Component";
import Controls from "./Controls";
import { TextareaBlockIcon } from "@/common/icons";

export const settings = {
    title: __("Textarea", "optiontics"),
    icon: <TextareaBlockIcon />,
    tags: ["textarea", "input"],
    category: "general",
    component: Component,
    controls: Controls,
    attributes: {
        displayName: __("Textarea", "optiontics"),
        type: "textarea",
        label: __("Textarea", "optiontics"),
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
