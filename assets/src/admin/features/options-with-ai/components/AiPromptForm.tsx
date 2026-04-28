/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";

/**
 * External dependencies
 */
import { Info } from "lucide-react";

/**
 * Internal dependencies
 */
import { Button } from "@/shadcn/components/ui/button";
import { Textarea } from "@/shadcn/components/ui/textarea";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/shadcn/components/ui/tooltip";
import { AiGenerateButtonIcon } from "@/common/icons";

interface AiPromptFormProps {
    prompt: string;
    isGenerating: boolean;
    isProviderConfigured: boolean;
    onPromptChange: (value: string) => void;
    onGenerate: () => void;
    onCancel: () => void;
}

export function AiPromptForm({
    prompt,
    isGenerating,
    isProviderConfigured,
    onPromptChange,
    onGenerate,
    onCancel,
}: AiPromptFormProps) {
    return (
        <div className="flex flex-col gap-3 bg-gray-50 rounded-xl p-4 border border-gray-200">
            <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-semibold text-gray-900">
                    {__("Not quite right? Describe what you want", "optiontics")}
                </span>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <span className="flex items-center gap-1 text-xs text-gray-400 cursor-default select-none">
                            <Info className="w-4 h-4 text-primary shrink-0" />
                        </span>
                    </TooltipTrigger>
                    <TooltipContent>
                        {__("AI can make mistakes. Review and adjust generated options as needed.", "optiontics")}
                    </TooltipContent>
                </Tooltip>
            </div>

            <Textarea
                value={prompt}
                onChange={(e) => onPromptChange(e.target.value)}
                placeholder={__('e.g "Add engraving text option" or "Make it more minimal"', "optiontics")}
                className="min-h-28 text-sm bg-white border-[#D9DDE3]! resize-none"
            />

            <div className="flex justify-end gap-2">
                <Button variant="outline" size="default" onClick={onCancel} type="button">
                    {__("Cancel", "optiontics")}
                </Button>
                <Button
                    size="default"
                    type="button"
                    onClick={onGenerate}
                    disabled={!isProviderConfigured || !prompt.trim() || isGenerating}
                    loading={isGenerating}
                    className="gap-1.5 border-0 px-2 text-white hover:opacity-90 transition-opacity"
                    style={{
                        background: "linear-gradient(90deg, #FF36E6 0%, #D439EC 25%, #A93DF3 50%, #933FF6 75%, #5243FE 100%)"
                    }}
                >
                    <AiGenerateButtonIcon />
                    {__("Generate", "optiontics")}
                </Button>
            </div>
        </div>
    );
}
