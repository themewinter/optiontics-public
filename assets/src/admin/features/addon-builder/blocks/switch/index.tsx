/**
 * Wordpress dependencies
 */
import { __ } from "@wordpress/i18n";

/**
 * Internal dependencies
 */
import Component from "./Component";
import Controls from "./Controls";
import { SwitchBlockIcon } from "@/common/icons";

export const settings = {
    title: __("Switch", "optiontics"),
    icon: <SwitchBlockIcon />,
    tags: [__("switch", "optiontics"), __("toggle", "optiontics")],
    category: __("general", "optiontics"),
    component: Component,
    controls: Controls,
    attributes: {
        displayName: __("Switch", "optiontics"),
        type: "switch",
        label: __("Switch", "optiontics"),
        desc: "",
        hide: false,
        required: false,
        isQuantity: false,
        checked: false,
        min: 1,
        max: 100,
        class: "",
        id: "",
        options: [
            {
                value: "Switch Option 1",
                type: "fixed",
                regular: "84",
                sale: "50",
                default: false,
                image: "",
            },
        ],
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
