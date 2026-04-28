import { useState } from "@wordpress/element";
import { useNavigate } from "react-router-dom";
import Api from "@/api";
import { craftJsToBackend, generateBlockId } from "@/admin/features/addon-builder/utils";
import type { Suggestion, AiField } from "../types";

interface UseOptionCreationReturn {
    isCreating: string | null;
    createOption: (suggestion: Suggestion) => Promise<void>;
}

function buildCraftDataFromAiFields(aiFields: AiField[]): Record<string, any> {
    const nodeIds: string[] = [];
    const nodes: Record<string, any> = {};

    aiFields.forEach((field) => {
        const nodeId = generateBlockId();
        nodeIds.push(nodeId);

        const craftType = field.type === "toggle" ? "switch" : field.type;
        const displayName = craftType.charAt(0).toUpperCase() + craftType.slice(1);

        const blockAttrs: Record<string, any> = {
            displayName,
            type: craftType,
            label: field.label,
            desc: field.description || "",
            hide: false,
            required: field.required,
            class: "",
            id: "",
            en_logic: false,
            fieldConditions: {
                condition: { visibility: "", match: "" },
                rules: [{ field: "", compare: "", value: "" }],
            },
            _styles: {
                height: { val: 32 },
                width: { val: 32 },
                radius: { val: 4 },
                mrR: { val: 8 },
            },
        };

        if (craftType === "switch") {
            blockAttrs.checked = false;
            blockAttrs.isQuantity = false;
            blockAttrs.min = 1;
            blockAttrs.max = 100;
            blockAttrs.options = [
                { value: field.label, type: "no_cost", regular: "0", sale: "", default: false, image: "" },
            ];
        } else if (field.options?.length && ["select", "radio", "checkbox"].includes(craftType)) {
            blockAttrs.options = field.options.map((opt, i) => ({
                value: opt.label,
                type: opt.price_type,
                regular: String(opt.price || 0),
                sale: "",
                default: i === 0,
                image: "",
            }));
            if (["radio", "checkbox"].includes(craftType)) {
                blockAttrs.isQuantity = false;
                blockAttrs.min = 1;
                blockAttrs.max = 100;
                blockAttrs.columns = 1;
            }
        }

        nodes[nodeId] = {
            type: { resolvedName: craftType },
            isCanvas: false,
            props: blockAttrs,
            displayName,
            hidden: false,
            nodes: [],
            linkedNodes: {},
            parent: "ROOT",
        };
    });

    return {
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
        ...nodes,
    };
}

export function useOptionCreation(onClose: () => void): UseOptionCreationReturn {
    const navigate = useNavigate();
    const [isCreating, setIsCreating] = useState<string | null>(null);

    const createOption = async (suggestion: Suggestion) => {
        setIsCreating(suggestion.id);
        try {
            const craftData = buildCraftDataFromAiFields(suggestion.fields);
            const backendFields = craftJsToBackend(craftData);

            const response = await Api.addons.createOption({
                title: suggestion.title,
                status: "draft",
                fields: backendFields,
                craftData: JSON.stringify(craftData),
            });
            if (response?.success) {
                onClose();
                navigate(`/update/${response?.data?.id}`);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsCreating(null);
        }
    };

    return { isCreating, createOption };
}
