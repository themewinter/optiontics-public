import { DUMMY_PRODUCT_PRICE } from "../constant";
export const convertDimensionsToStyle = (dimensions: any) => {
    return `${dimensions.top || 0}${dimensions.unit} ${dimensions.right || 0}${
        dimensions.unit
    } ${dimensions.bottom || 0}${dimensions.unit} ${dimensions.left || 0}${
        dimensions.unit
    }`;
};

/**
 * Generate a random block ID
 */
export const generateBlockId = (): string => {
    const prefix = Math.random().toString(36).substr(2, 4);
    const suffix = Math.random().toString(36).substr(2, 6);
    return `${prefix}-${suffix}`;
};

const typeMap: Record<string, string> = {
    textfield: "textfield",
    textarea: "textarea",
    number: "number",
    select: "select",
    checkbox: "checkbox",
    radio: "radio",
    heading: "heading",
    text: "text",
    switch: "switch",
    button: "button",
    button_group: "button_group",
    email: "email",
    telephone: "telephone",
};

/**
 * Convert Craft.js format to Backend format
 */
export const craftJsToBackend = (
    craftData: any,
    rootNodeId: string = "ROOT",
): any[] => {
    if (!craftData || !craftData[rootNodeId]) {
        return [];
    }

    const fields: any[] = [];

    // Recursively process nodes
    const processNode = (nodeId: string) => {
        const node = craftData[nodeId];
        if (!node) return;

        // Skip ROOT node
        if (nodeId === rootNodeId) {
            // Process children of ROOT
            if (node.nodes && node.nodes.length > 0) {
                node.nodes.forEach((childId: string) => processNode(childId));
            }
            return;
        }

        const blockType = node.props.type;
        const props = node.props || {};
        // Craft.js serialised state keys each node by its id but does not
        // expose `.id` on the node object itself. Using `nodeId` directly
        // keeps the blockid stable across saves, which is what conditional
        // logic `rule.field` references (also craft nodeId). A fresh
        // generateBlockId() per save would desync the two.
        const blockid = nodeId;

        // Map block props to backend field format
        const field: any = {
            blockid,
            type: typeMap[blockType || "textfield"],
        };

        // Map common properties
        if (props.label !== undefined) field.label = props.label;
        if (props.desc !== undefined) field.desc = props.desc;
        if (props.placeholder !== undefined)
            field.placeholder = props.placeholder;
        if (props.pricePosition !== undefined)
            field.pricePosition = props.pricePosition;
        if (props.required !== undefined) field.required = props.required;
        if (props.hide !== undefined) field.hide = props.hide;
        if (props.class !== undefined) field.class = props.class;
        if (props.id !== undefined) field.id = props.id;
        if (props.text !== undefined) field.label = props.text || field.label;
        if (props.heading !== undefined)
            field.label = props.heading || field.label;
        if (props.value !== undefined) field.value = props.value;
        if (props.tag !== undefined) field.tag = props.tag;
        if (props.en_logic !== undefined) field.en_logic = props.en_logic;
        if (props.fieldConditions !== undefined)
            field.fieldConditions = props.fieldConditions;
        if (props.isQuantity !== undefined) field.isQuantity = props.isQuantity;
        if (props.vertical !== undefined) field.vertical = props.vertical;
        if (props.min !== undefined) field.min = props.min;
        if (props.max !== undefined) field.max = props.max;
        if (props.columns !== undefined) field.columns = props.columns;
        if (props.selection !== undefined) field.selection = props.selection;
        if (props.businessOnly !== undefined) field.businessOnly = props.businessOnly;

        // Map pricing options
        if (props.options && Array.isArray(props.options)) {
            field._options = props.options;
        } else if (props.price || props.priceType) {
            field._options = [
                {
                    type: props.priceType || "fixed",
                    regular: props.price || props.regular || "",
                    sale: props.sale || "",
                },
            ];
        }

        fields.push(field);

        // Process child nodes
        if (node.nodes && node.nodes.length > 0) {
            node.nodes.forEach((childId: string) => processNode(childId));
        }
    };

    processNode(rootNodeId);
    return fields;
};

/**
 * Calculates a specified percentage of a given number.
 * @param {number} percent - The percentage to calculate (e.g., 10 for 10%).
 * @param {number} total - The total number.
 * @returns {number} The calculated percentage value.
 */
export const calculatePercentage = (
    percent: number | string,
    total: number | string = DUMMY_PRODUCT_PRICE,
) => {
    const percentValue = Number(percent);
    const totalValue = Number(total);
    if (isNaN(percentValue) || isNaN(totalValue)) {
        console.error("Invalid input: Please enter valid numbers.");
        return NaN; // Return 'Not a Number' for invalid inputs
    }
    const price = ((percentValue / 100) * totalValue) as number;
    return price;
};

/**
 * Get price value based on type (fixed or percentage).
 * @param {string} type - The price type ('fixed', 'percentage', or 'no_cost').
 * @param {number} value - The price value.
 * @param {Function} calculatePercentage - Function to calculate percentage price.
 * @returns {number} The calculated price value.
 */
export const getPrice = (type: string, value: number, calculatePercentage: any): number => {
    if (!value) return 0;
    return type === "percentage" ? calculatePercentage(value) : Number(value) as number;
};
