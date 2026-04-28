import { useState } from "@wordpress/element";
import { toast } from "sonner";
import { __ } from "@wordpress/i18n";
import Api from "@/api";
import type { Suggestion } from "../types";

interface UseAiGenerateReturn {
    prompt: string;
    setPrompt: (val: string) => void;
    isGenerating: boolean;
    suggestions: Suggestion[] | null;
    generate: () => Promise<void>;
    reset: () => void;
}

export function useAiGenerate(): UseAiGenerateReturn {
    const [prompt, setPrompt] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [suggestions, setSuggestions] = useState<Suggestion[] | null>(null);

    const generate = async () => {
        if (!prompt.trim()) return;
        setIsGenerating(true);
        try {
            const response = await Api.ai.generateOptions(prompt);
            if (response?.success) {
                const rawSuggestions: any[] = response.data?.suggestions ?? [];
                if (!rawSuggestions.length) {
                    toast.error(__("AI response did not contain any fields. Try a more specific prompt.", "optiontics"));
                    return;
                }
                const parsed: Suggestion[] = rawSuggestions
                    .filter((s: any) => Array.isArray(s?.fields) && s.fields.length > 0)
                    .map((s: any, i: number) => ({
                        id: `ai-${Date.now()}-${i}`,
                        title: s.title || __("Generated Options", "optiontics"),
                        badge: s.badge ?? null,
                        description: s.description || "",
                        fields: s.fields,
                    }));
                if (!parsed.length) {
                    toast.error(__("AI response did not contain any usable fields.", "optiontics"));
                    return;
                }
                setSuggestions(parsed);
            } else {
                toast.error(response?.message ?? __("Generation failed. Please try again.", "optiontics"));
            }
        } catch {
            toast.error(__("Something went wrong. Please try again.", "optiontics"));
        } finally {
            setIsGenerating(false);
        }
    };

    const reset = () => {
        setPrompt("");
        setSuggestions(null);
    };

    return { prompt, setPrompt, isGenerating, suggestions, generate, reset };
}
