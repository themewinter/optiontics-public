export interface AiFieldOption {
    label: string;
    price: number;
    price_type: "fixed" | "percentage" | "no_cost";
}

export interface AiField {
    type: string;
    label: string;
    description: string;
    placeholder: string;
    required: boolean;
    options?: AiFieldOption[];
}

export interface Suggestion {
    id: string;
    title: string;
    badge: string | null;
    description: string;
    fields: AiField[];
}

export interface BuildWithAIModalProps {
    isOpen: boolean;
    onClose: () => void;
    onBack: () => void;
}
