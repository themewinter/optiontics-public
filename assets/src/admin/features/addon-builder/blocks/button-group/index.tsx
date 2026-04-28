/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";

/**
 * Internal dependencies
 */
import Component from "./Component";
import Controls from "./Controls";
import { ButtonGroupBlockIcon } from "@/common/icons";

export const settings = {
    title: __("Button Group", "optiontics"),
    icon: <ButtonGroupBlockIcon />,
    tags: [
        __("button", "optiontics"),
        __("group", "optiontics"),
        __("options", "optiontics"),
    ],
    category: __("general", "optiontics"),
    component: Component,
    controls: Controls,
    attributes: {
        displayName: __("Button Group", "optiontics"),
        type: "button_group",
        label: __("Button group", "optiontics"),
        desc: "",
        hide: false,
        required: false,
        selection: "single",
        options: [
            {
                value: __("Option 1", "optiontics"),
                type: "fixed",
                regular: "",
                sale: "",
                default: true,
                image: "",
            },
            {
                value: __("Option 2", "optiontics"),
                type: "fixed",
                regular: "",
                sale: "",
                default: false,
                image: "",
            },
            {
                value: __("Option 3", "optiontics"),
                type: "fixed",
                regular: "",
                sale: "",
                default: false,
                image: "",
            },
        ],
        class: "",
        id: "",
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
