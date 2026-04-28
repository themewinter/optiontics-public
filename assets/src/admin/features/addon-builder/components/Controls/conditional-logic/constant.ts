/**
 * Wordpress dependencies
 */
import { __ } from "@wordpress/i18n";

/**
 * Internal dependencies
 */
import { FieldConditionsType } from "./types";

/**
 * Constants
 */
export const EXCLUDED_NODE_IDS = ["ROOT"];
export const EXCLUDED_RESOLVED_NAMES = ["body"];

export const OPTION_BASED_FIELD_TYPES = [
    "radio",
    "select",
    "dropdown",
    "checkbox",
    "switch",
    "button",
];
 

export const NUMBER_FIELD_TYPES = ["number"];
export const TEXT_BASED_FIELD_TYPES = ["textfield", "textarea", "email", "telephone"];

export const COMPARISON_OPERATORS = {
    BASIC: ["is", "not_is"],
    OPTION: ["is", "not_is", "in", "not_in"],
    TEXT: ["is", "not_is", "contains", "not_contains"],
    NUMBER: [
        "is",
        "not_is",
        "greater_than",
        "less_than",
        "greater_equal",
        "less_equal",
    ],
} as const;

export const COMPARISON_LABELS: Record<string, string> = {
    is: __("Is", "optiontics"),
    not_is: __("Not Is", "optiontics"),
    in: __("In", "optiontics"),
    not_in: __("Not In", "optiontics"),
    contains: __("Contains", "optiontics"),
    not_contains: __("Not Contains", "optiontics"),
    greater_than: __("Greater Than", "optiontics"),
    less_than: __("Less Than", "optiontics"),
    greater_equal: __("Greater or Equal", "optiontics"),
    less_equal: __("Less or Equal", "optiontics"),
};

export const DEFAULT_FIELD_CONDITIONS: FieldConditionsType = {
    condition: {
        visibility: "show",
        match: "all",
    },
    rules: [
        {
            field: "",
            compare: "",
            value: "",
        },
    ],
};
