export interface TemplateBlock {
    type: string;
    label: string;
    options?: string[];
    placeholder?: string;
}

export type TemplateCategory = "all" | "fashion" | "home" | "food" | "accessories" | "electronics";

export interface OptionTemplate {
    id: string;
    name: string;
    image: string;
    blocks: TemplateBlock[];
    category: TemplateCategory;
}




// ─── Helpers ────────────────────────────────────────────────────────────────

const DEFAULT_CONDITIONS = {
    condition: { visibility: "", match: "" },
    rules: [{ field: "", compare: "", value: "" }],
};

const DEFAULT_STYLES = {
    height: { val: 32 },
    width: { val: 32 },
    radius: { val: 4 },
    mrR: { val: 8 },
};

function mkOption(value: string, isDefault = false) {
    return { value, type: "fixed", regular: "", sale: "", default: isDefault, image: "" };
}

function buildField(blockid: string, block: TemplateBlock): any {
    const base: any = {
        blockid,
        label: block.label,
        desc: "",
        required: false,
        class: "",
        id: "",
        en_logic: false,
        fieldConditions: DEFAULT_CONDITIONS,
    };

    switch (block.type) {
        case "text-input":
            return {
                ...base,
                type: "textfield",
                placeholder: block.placeholder ?? "",
                pricePosition: "with_title",
                _options: [{ type: "fixed", regular: "", sale: "" }],
            };
        case "number-input":
            return {
                ...base,
                type: "number",
                placeholder: block.placeholder ?? "1",
            };
        case "textarea":
            return {
                ...base,
                type: "textarea",
                placeholder: block.placeholder ?? "",
            };
        case "dropdown":
            return {
                ...base,
                type: "select",
                hide: false,
                _options: (block.options ?? []).map((o, i) => mkOption(o, i === 0)),
            };
        case "button-select":
        case "color-swatch":
            return {
                ...base,
                type: "radio",
                hide: false,
                isQuantity: false,
                min: 1,
                max: 100,
                columns: 1,
                _options: (block.options ?? []).map((o, i) => mkOption(o, i === 0)),
            };
        default:
            return { ...base, type: "textfield", placeholder: "" };
    }
}

function buildCraftNode(nodeId: string, block: TemplateBlock, field: any): any {
    const props: any = {
        displayName: block.label,
        type: field.type,
        label: block.label,
        desc: "",
        class: "",
        id: "",
        _styles: DEFAULT_STYLES,
        en_logic: false,
        fieldConditions: DEFAULT_CONDITIONS,
    };

    // Convert _options → options for CraftJS props
    if (field._options) props.options = field._options;
    if (field.placeholder !== undefined) props.placeholder = field.placeholder;
    if (field.pricePosition !== undefined) props.pricePosition = field.pricePosition;
    if (field.required !== undefined) props.required = field.required;
    if (field.hide !== undefined) props.hide = field.hide;
    if (field.isQuantity !== undefined) props.isQuantity = field.isQuantity;
    if (field.min !== undefined) props.min = field.min;
    if (field.max !== undefined) props.max = field.max;
    if (field.columns !== undefined) props.columns = field.columns;

    return {
        type: { resolvedName: field.type },
        isCanvas: false,
        props,
        displayName: block.label,
        hidden: false,
        nodes: [],
        linkedNodes: {},
        id: nodeId,
        parent: "ROOT",
    };
}

/**
 * Converts a template's blocks into the fields (backend format) and
 * craftData (CraftJS format) needed to pre-populate the builder.
 */
export function buildTemplatePayload(template: OptionTemplate): {
    fields: any[];
    craftData: any;
} {
    const nodeIds: string[] = [];
    const craftNodes: Record<string, any> = {};
    const fields: any[] = [];

    const idBase = template.id.replace(/-/g, "").slice(0, 8);

    template.blocks.forEach((block, i) => {
        const nodeId = `tpl-${idBase}-${i}`;
        const field = buildField(nodeId, block);
        const craftNode = buildCraftNode(nodeId, block, field);

        fields.push(field);
        craftNodes[nodeId] = craftNode;
        nodeIds.push(nodeId);
    });

    const craftData = {
        ROOT: {
            type: { resolvedName: "body" },
            isCanvas: true,
            props: {
                displayName: "Body",
                background: "#ffffff",
                color: "#000000",
                minHeight: "350px",
                minWidth: "300px",
                width: { size: 100, unit: "%" },
                padding: { top: 15, right: 15, bottom: 15, left: 15, isLinked: false, unit: "px" },
            },
            displayName: "Body",
            hidden: false,
            nodes: nodeIds,
            linkedNodes: {},
        },
        ...craftNodes,
    };

    return { fields, craftData };
}

