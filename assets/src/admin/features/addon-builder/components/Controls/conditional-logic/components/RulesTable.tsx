/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";

/**
 * Internal dependencies
 */
import { RuleRow } from "./RuleRow";
import { RulesTableHeader } from "./RulesTableHeader";
import { ConditionalRuleType } from "../types";
import { FieldInfoType } from "../types";

export const RulesTable: React.FC<{
    rules: ConditionalRuleType[];
    availableFields: FieldInfoType[];
    onUpdateRule: (index: number, updates: Partial<ConditionalRuleType>) => void;
    onDeleteRule: (index: number) => void;
}> = ({ rules, availableFields, onUpdateRule, onDeleteRule }) => {
    if (rules.length === 0) return null;

    return (
        <div className="border border-gray-200 rounded-md overflow-hidden">
            <RulesTableHeader />
            <div className="divide-y divide-gray-200">
                {rules.map((rule, index) => (
                    <RuleRow
                        key={index}
                        rule={rule}
                        index={index}
                        availableFields={availableFields}
                        onUpdate={onUpdateRule}
                        onDelete={onDeleteRule}
                    />
                ))}
            </div>
        </div>
    );
};