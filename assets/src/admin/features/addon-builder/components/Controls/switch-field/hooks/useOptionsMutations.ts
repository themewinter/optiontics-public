/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";

/**
 * Internal dependencies
 */
import { uploadFromMedia } from "@/helpers";
import { Option } from "../../options";
/**
 * Encapsulates mutations on options.
 * Single Responsibility: CRUD-like operations for options state.
 * 
 * Generic hook that works for any option-based block (Radio, Dropdown, etc.)
 */
export function useSwitchFieldOptionsMutations(
    options: Option[],
    setAttribute: (key: string, value: any) => void,
) {
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

    const removeImage = (index: number): void => {
        updateOption(index, "image", "");
    };

    const setOptions = (next: Option[]) => setAttribute("options", next);

    const updateOptionFields = (index: number, updates: Partial<Option>) => {
        const updatedOptions = [...options];
        updatedOptions[index] = {
            ...updatedOptions[index],
            ...updates,
        } as Option;
        setAttribute("options", updatedOptions);
    };

    return {
        updateOption,
        setOptions,
        uploadImage,
        removeImage,
        updateOptionFields,
    };
}

