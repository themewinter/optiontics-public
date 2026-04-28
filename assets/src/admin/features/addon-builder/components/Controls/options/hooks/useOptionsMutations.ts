/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";

/**
 * Internal dependencies
 */
import { uploadFromMedia } from "@/helpers";
import { Option } from "../types";

/**
 * Encapsulates mutations on options.
 * Single Responsibility: CRUD-like operations for options state.
 * 
 * Generic hook that works for any option-based block (Radio, Dropdown, etc.)
 */
export function useOptionsMutations(
    options: Option[],
    setAttribute: (key: string, value: any) => void,
    blockType?: string
) {

    /**
     * Adds a new option.
     */
    const addOption = () => {
        let newOption: Option = {
            value: `Option ${options.length + 1}`,
            type: "fixed",
            regular: "",
            sale: "",
            default: false,
            image: "",
        };
        // If the block type is button, set the default values for the option
        if (blockType === "button") {
            newOption.value = `Button ${options.length + 1}`;
            newOption.type = "fixed";
            newOption.regular = "";
            newOption.sale = "";
            newOption.default = false;
        }
        setAttribute("options", [...options, newOption]);
    };

    /**
     * Updates a single option field.
     * @param index - The index of the option to update.
     * @param field - The field to update.
     * @param value - The new value for the field.
     */
    const updateOption = (
        index: number,
        field: keyof Option,
        value: any
    ) => {
        const updatedOptions = [...options];
        updatedOptions[index] = {
            ...updatedOptions[index],
            [field]: value,
        } as Option;
        setAttribute("options", updatedOptions);
    };

    /**
     * Updates multiple fields for an option at once.
     * This is useful for updating multiple fields without overwriting other fields.
     * @param index - The index of the option to update.
     * @param updates - The fields to update and their new values.
     */

    const updateOptionFields = (index: number, updates: Partial<Option>) => {
        const updatedOptions = [...options];
        updatedOptions[index] = {
            ...updatedOptions[index],
            ...updates,
        } as Option;
        setAttribute("options", updatedOptions);
    };

    const deleteOption = (index: number) => {
        const updatedOptions = options.filter((_, i) => i !== index);
        setAttribute("options", updatedOptions);
    };

    /**
     * Toggles the default state for an option.
     * @param index - The index of the option to toggle.
     */
    const toggleDefault = (index: number) => {
        // For checkbox blocks, allow multiple selections (toggle independently)
        // For radio/dropdown blocks, only one option can be active at a time
        if (blockType === "checkbox") {
            const updatedOptions = options.map((opt, i) => ({
                ...opt,
                default: i === index ? !opt.default : opt.default,
            }));
            setAttribute("options", updatedOptions);
        } else {
            // Radio/Dropdown: only one can be active
            const updatedOptions = options.map((opt, i) => ({
                ...opt,
                default: i === index ? !opt.default : false,
            }));
            setAttribute("options", updatedOptions);
        }
    };
    /**
     * Uploads an image for an option.
     * @param event - The event object.
     * @param index - The index of the option to upload the image for.
     */
    const uploadImage = (
        event: React.MouseEvent<HTMLElement, MouseEvent>,
        index: number
    ): void => {
        uploadFromMedia(
            event,
            (url: string) => {
                updateOption(index, "image", url);
            },
            {
                title: __("Choose Image", "optiontics"),
                libraryType: ["image"],
                mimeCheck: (mime?: string) =>
                    mime === "image/jpeg" ||
                    mime === "image/png" ||
                    mime === "image/gif" ||
                    mime === "image/webp",
                cacheKey: "imageUploader",
            }
        );
    };

    /**
     * Removes the image for an option.
     * @param index - The index of the option to remove the image for.
     */
    const removeImage = (index: number): void => {
        updateOption(index, "image", "");
    };

    /**
     * Sets the options.
     * @param next - The new options.
     */
    const setOptions = (next: Option[]) => setAttribute("options", next);

    return {
        addOption,
        updateOption,
        deleteOption,
        toggleDefault,
        uploadImage,
        removeImage,
        setOptions,
        updateOptionFields,
    };
}

