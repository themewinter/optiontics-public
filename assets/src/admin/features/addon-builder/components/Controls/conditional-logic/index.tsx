/**
 * WordPress dependencies
 */
import { useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";

/**
 * External dependencies
 */
import { useNode } from "@craftjs/core";
import { Settings2 } from "lucide-react";

/**
 * Internal dependencies
 */
import { ControlGeneratorProps } from "../../../types";
import { useAvailableFields } from "./hooks/useAvailableFields";
import { ConditionalRuleType, FieldConditionsType } from "./types";
import { DEFAULT_FIELD_CONDITIONS } from "./constant";
import { ConditionalLogicToggle } from "./components/ConditionalLogicToggle";
import { ConditionalLogicModal } from "./components/ConditionalLogicModal";

/**
 * Conditional Logic Control Component
 *
 * Shows an enable/disable toggle and a "Configure conditions" button that
 * opens a modal with the full conditions editor.
 */
export default function ConditionalLogicControl({
    attributes,
    setAttribute,
}: ControlGeneratorProps<any>): React.ReactElement {
    const { id: currentNodeId } = useNode();
    const availableFields = useAvailableFields(currentNodeId);
    const [modalOpen, setModalOpen] = useState(false);

    const enLogic = attributes.en_logic || false;
    const fieldConditions: FieldConditionsType =
        attributes.fieldConditions || DEFAULT_FIELD_CONDITIONS;

    const handleEnableLogic = (enabled: boolean) => {
        setAttribute("en_logic", enabled);
    };

    const updateFieldConditions = (updates: Partial<FieldConditionsType>) => {
        setAttribute("fieldConditions", {
            ...fieldConditions,
            ...updates,
        });
    };

    const handleVisibilityChange = (visibility: "show" | "hide") => {
        updateFieldConditions({
            condition: { ...fieldConditions.condition, visibility },
        });
    };

    const handleMatchChange = (match: "any" | "all") => {
        updateFieldConditions({
            condition: { ...fieldConditions.condition, match },
        });
    };

    const handleAddRule = () => {
        const newRule: ConditionalRuleType = { field: "", compare: "", value: "" };
        updateFieldConditions({ rules: [...fieldConditions.rules, newRule] });
    };

    const handleUpdateRule = (index: number, updates: Partial<ConditionalRuleType>) => {
        const updatedRules = [...fieldConditions.rules];
        const currentRule = updatedRules[index];
        if (!currentRule) return;
        updatedRules[index] = { ...currentRule, ...updates };
        updateFieldConditions({ rules: updatedRules });
    };

    const handleDeleteRule = (index: number) => {
        updateFieldConditions({
            rules: fieldConditions.rules.filter((_, i) => i !== index),
        });
    };

    return (
        <div className="flex flex-col gap-4">
            {/* Toggle row */}
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                    {__("Conditional behavior", "optiontics")}
                </span>
                <ConditionalLogicToggle
                    enabled={enLogic}
                    onChange={handleEnableLogic}
                />
            </div>

            {/* Configure button — only shown when logic is enabled */}
            {enLogic && (
                <button
                    type="button"
                    onClick={() => setModalOpen(true)}
                    className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg border border-blue-300 bg-white text-sm font-medium text-gray-700 hover:bg-blue-50 transition-colors cursor-pointer"
                >
                    <Settings2 className="w-4 h-4 text-blue-400" />
                    {fieldConditions.rules.length > 0
                        ? __("Modify conditions", "optiontics")
                        : __("Configure conditions", "optiontics")}
                </button>
            )}

            <ConditionalLogicModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                fieldConditions={fieldConditions}
                availableFields={availableFields}
                onVisibilityChange={handleVisibilityChange}
                onMatchChange={handleMatchChange}
                onAddRule={handleAddRule}
                onUpdateRule={handleUpdateRule}
                onDeleteRule={handleDeleteRule}
            />
        </div>
    );
}
