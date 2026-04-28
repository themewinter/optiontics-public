export interface ConditionalRuleType {
    field: string;
    compare: string;
    value: string | string[];
}

export interface ConditionalConditionType {
    visibility: "show" | "hide";
    match: "any" | "all";
}

export interface FieldConditionsType {
    condition: ConditionalConditionType;
    rules: ConditionalRuleType[];
}

export interface FieldInfoType {
    id: string;
    label: string;
    type: string;
}

export type ComparisonOperatorType = string;
export type FieldTypeType = string;
