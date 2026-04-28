/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";

/**
 * Internal dependencies
 */
import { settings as bodySettings } from "./blocks/body";
import { settings as radioSettings } from "./blocks/radio";
import { settings as headingSettings } from "./blocks/heading";
import { settings as textFieldSettings } from "./blocks/text-field";
import { settings as dropdownSettings } from "./blocks/dropdown";
import { settings as checkboxSettings } from "./blocks/checkbox";
import { settings as switchSettings } from "./blocks/switch";
import { settings as numberFieldSettings } from "./blocks/number-field";
import { settings as textareaSettings } from "./blocks/textarea";
import { settings as buttonGroupSettings } from "./blocks/button-group";
import { settings as emailSettings } from "./blocks/email";
// import { settings as buttonSettings } from "./blocks/button";
// import { settings as telephoneSettings } from "./blocks/telephone";

export const blockLists = [
    bodySettings,
    textFieldSettings,
    headingSettings,
    radioSettings,
    dropdownSettings,
    checkboxSettings,
    switchSettings,
    numberFieldSettings,
    textareaSettings,
    buttonGroupSettings,
    emailSettings,
    // buttonSettings,
    // telephoneSettings,
];

export const priceTypeOptions = [
    {
        label: __("Fixed", "optiontics"),
        value: "fixed",
    },
    {
        label: __("Percentage", "optiontics"),
        value: "percentage",
    },
    {
        label: __("No cost", "optiontics"),
        value: "no_cost",
    },
];

export const DUMMY_PRODUCT_PRICE = 50;