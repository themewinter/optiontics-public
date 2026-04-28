/**
 * Wordpress dependencies
 */
import { __ } from "@wordpress/i18n";

/**
 * Internal dependencies
 */
import Component from "./Component";
import Controls from "./Controls";
import { RadioBlockIcon } from "@/common/icons";

export const settings = {
    title: __("Radio", "optiontics"),
    icon: <RadioBlockIcon />,
    tags: [__("radio", "optiontics"), __("options", "optiontics")],
    category: __("general", "optiontics"),
    component: Component,
    controls: Controls,
    attributes: {
        displayName: __("Radio", "optiontics"),
        type: "radio",
        label: __("Radio", "optiontics"),
        desc: "",
        hide: false,
        required: false,
        isQuantity: false,
        min: 1,
        max: 100,
        columns: 1,
        options: [
            {
                value: "Option 1",
                type: "fixed",
                regular: "",
                sale: "",
                default: false,
                image: "",
            },
            {
                value: "Option 2",
                type: "fixed",
                regular: "",
                sale: "",
                default: true,
                image: "",
            },
            {
                value: "Option 3",
                type: "fixed",
                regular: "",
                sale: "",
                default: false,
                image: "",
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
