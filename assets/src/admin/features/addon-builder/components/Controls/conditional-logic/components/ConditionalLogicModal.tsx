/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";

/**
 * Internal dependencies
 */
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/shadcn/components/ui/dialog";
import { Button } from "@/shadcn/components/ui/button";
import { ConditionSelector } from "./ConditionSelector";
import { RulesTable } from "./RulesTable";
import { AddRuleButton } from "./AddRuleButton";
import { EmptyFieldsMessage } from "./EmptyFieldMessage";
import { ConditionalRuleType, FieldConditionsType, FieldInfoType } from "../types";

interface Props {
    open: boolean;
    onClose: () => void;
    fieldConditions: FieldConditionsType;
    availableFields: FieldInfoType[];
    onVisibilityChange: (value: "show" | "hide") => void;
    onMatchChange: (value: "any" | "all") => void;
    onAddRule: () => void;
    onUpdateRule: (index: number, updates: Partial<ConditionalRuleType>) => void;
    onDeleteRule: (index: number) => void;
}

export const ConditionalLogicModal: React.FC<Props> = ({
    open,
    onClose,
    fieldConditions,
    availableFields,
    onVisibilityChange,
    onMatchChange,
    onAddRule,
    onUpdateRule,
    onDeleteRule,
}) => (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
        <DialogContent className="w-[95vw] md:max-w-2xl p-0 gap-0 overflow-hidden">
            <DialogHeader className="px-6 py-4 border-b border-gray-200">
                <DialogTitle className="text-base font-semibold text-gray-900">
                    {__("Field behavior conditions", "optiontics")}
                </DialogTitle>
            </DialogHeader>

            <div className="px-6 py-5 flex flex-col gap-4">
                <ConditionSelector
                    visibility={fieldConditions.condition.visibility}
                    match={fieldConditions.condition.match}
                    onVisibilityChange={onVisibilityChange}
                    onMatchChange={onMatchChange}
                />

                <div className="border-t border-gray-100" />

                <div className="max-h-[50vh] overflow-y-auto">
                    <RulesTable
                        rules={fieldConditions.rules}
                        availableFields={availableFields}
                        onUpdateRule={onUpdateRule}
                        onDeleteRule={onDeleteRule}
                    />
                </div>

                <AddRuleButton
                    onAdd={onAddRule}
                    disabled={availableFields.length === 0}
                />

                {availableFields.length === 0 && <EmptyFieldsMessage />}
            </div>

            <div className="flex justify-end px-6 py-4 border-t border-gray-200 bg-gray-50">
                <Button variant="outline" size="sm" onClick={onClose}>
                    {__("Close", "optiontics")}
                </Button>
            </div>
        </DialogContent>
    </Dialog>
);
