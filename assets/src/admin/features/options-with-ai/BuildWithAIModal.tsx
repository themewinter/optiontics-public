/**
 * WordPress dependencies
 */
import { useEffect } from "@wordpress/element";
import { __ } from "@wordpress/i18n";

/**
 * External dependencies
 */
import { useNavigate } from "react-router-dom";

/**
 * Internal dependencies
 */
import {
    Dialog,
    DialogContent,
} from "@/shadcn/components/ui/dialog";
import { If } from "@/common/components/If";
import { AiModalHeader } from "./components/AiModalHeader";
import { AiPromptForm } from "./components/AiPromptForm";
import { SuggestionGrid } from "./components/SuggestionGrid";
import { useAiGenerate } from "./hooks/useAiGenerate";
import { useOptionCreation } from "./hooks/useOptionCreation";
import {
    useSettingsApi,
    useSettingsState,
} from "@/admin/features/settings/store/useSettings";
import { SETTINGS_PATH } from "@/admin/router/routeDefinition";
import type { BuildWithAIModalProps } from "./types";
import { AlertNotice } from "@/common/components";

export function BuildWithAIModal({ isOpen, onClose, onBack }: BuildWithAIModalProps) {
    const { prompt, setPrompt, isGenerating, suggestions, generate, reset } = useAiGenerate();
    const { isCreating, createOption } = useOptionCreation(onClose);
    const { data: settings, initialized } = useSettingsState();
    const { fetchSettings } = useSettingsApi();
    const navigate = useNavigate();

    useEffect(() => {
        if (!initialized) {
            fetchSettings();
        }
    }, [initialized]);

    const isProviderConfigured = !!settings.ai_active_provider;

    const handleClose = () => {
        reset();
        onClose();
    };

    const handleCancel = () => {
        reset();
        onBack();
    };

    const handleConfigure = () => {
        handleClose();
        navigate(SETTINGS_PATH);
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="max-w-3xl w-full p-0 gap-0 overflow-hidden">
                <AiModalHeader />

                <div className="p-6 flex flex-col gap-6 max-h-[80vh] overflow-y-auto">

                    <If condition={!isProviderConfigured}>
                        <AlertNotice
                            variant="danger"
                            title={__("AI provider not configured", "optiontics")}
                            description={__("Set up an AI provider in settings before generating options.", "optiontics")}
                            actionLabel={__("Go to Settings", "optiontics")}
                            onAction={handleConfigure}
                        />
                    </If>

                    <AiPromptForm
                        prompt={prompt}
                        isGenerating={isGenerating}
                        isProviderConfigured={isProviderConfigured}
                        onPromptChange={setPrompt}
                        onGenerate={generate}
                        onCancel={handleCancel}
                    />

                    <If condition={!!suggestions}>
                        <SuggestionGrid
                            suggestions={suggestions ?? []}
                            isCreating={isCreating}
                            onUseThis={createOption}
                        />
                    </If>
                </div>
            </DialogContent>
        </Dialog>
    );
}
