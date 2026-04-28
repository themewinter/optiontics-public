/**
 * Wordpress dependencies
 */
import { __ } from "@wordpress/i18n";

/**
 * Internal dependencies
 */
import Component from "./Component";
import Controls from "./Controls";
import { EmailBlockIcon } from "@/common/icons";

export const settings = {
    title: __("Email", "optiontics"),
    icon: <EmailBlockIcon />,
    tags: ["email", "input"],
    category: "general",
    component: Component,
    controls: Controls,
    attributes: {
        displayName: __("Email", "optiontics"),
        type: "email",
        label: __("Email", "optiontics"),
        desc: "",
        placeholder: __("you@example.com", "optiontics"),
        pricePosition: "with_title",
        required: false,
        businessOnly: false,
        options: [
            {
                type: "fixed",
                regular: "",
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
