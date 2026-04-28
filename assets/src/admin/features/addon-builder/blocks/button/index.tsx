/**
 * Wordpress dependencies
 */
import { __ } from "@wordpress/i18n";

/**
 * Internal dependencies
 */
import Component from "./Component";
import Controls from "./Controls";
import { ButtonBlockIcon } from "@/common/icons/ButtonBlockIcon";

export const settings = {
    title: __("Button", "optiontics"),
    icon: <ButtonBlockIcon />,
    tags: [__("button", "optiontics"), __("options", "optiontics")],
    category: __("general", "optiontics"),
    component: Component,
    controls: Controls,
    attributes: {
        displayName: __("Button", "optiontics"),
        type: "button",
        label: __("Button", "optiontics"),
        desc: "",
        hide: false,
        required: false,
        vertical: false,
        options: [
            {
                value: "Button 1",
                type: "fixed",
                regular: "Free",
                sale: "",
                default: false,
            },
            {
                value: "Button 2",
                type: "fixed",
                regular: "Free",
                sale: "",
                default: true,
            },
            {
                value: "Button 3",
                type: "fixed",
                regular: "Free",
                sale: "",
                default: false,
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

