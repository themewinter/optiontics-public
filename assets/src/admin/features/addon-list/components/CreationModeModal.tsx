/**
 * WordPress dependencies
 */
import { useDispatch } from "@wordpress/data";
import { useState, useEffect } from "@wordpress/element";
import { __ } from "@wordpress/i18n";

/**
 * External dependencies
 */
import { useNavigate } from "react-router-dom";

/**
 * Internal dependencies
 */
import Api from "@/api";
import { stores } from "@/globalConstant";
import { If } from "@/common/components/If";
import { AiBrainIcon, OptionCreationIcon, OptionTemplateIcon } from "@/common/icons";
import {
    Dialog,
    DialogContent,
    DialogHeader,
} from "@/shadcn/components/ui/dialog";
import { cn } from "@/shadcn/lib/utils";
import { BuildWithAIModal } from "../../options-with-ai/BuildWithAIModal";
import { useSettingsApi, useSettingsState } from "../../settings/store/useSettings";

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

interface CreationCardProps {
    icon: (isHovered: boolean) => React.ReactNode;
    title: string;
    description: string;
    onClick: () => void;
    disabled?: boolean;
}

const CreationCard = ({ icon, title, description, onClick, disabled = false }: CreationCardProps) => {
    const [isHovered, setIsHovered] = useState(false);
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={cn(
                "flex flex-col items-center text-center gap-4 px-8 py-10 rounded-xl border-1 transition-all cursor-pointer w-full",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                isHovered ? "bg-[var(--opt-primary-softest)] border-[var(--opt-primary-soft-border)]" : "bg-[var(--opt-white)] border-[var(--opt-border-muted)]"
            )}
        >
            <div className="flex items-center justify-center">
                {icon(isHovered)}
            </div>
            <div className="flex flex-col gap-1">
                <span className="text-lg font-medium text-[var(--opt-text-title)]">{title}</span>
                <span className="text-sm text-gray-500 leading-relaxed">{description}</span>
            </div>
        </button>
    );
};

type Step = "selection" | "ai";

export function CreationModeModal({ isOpen, onClose }: Props) {
    const navigate = useNavigate();
    const { setAddonBuilderState } = useDispatch(stores?.addons);
    const [step, setStep] = useState<Step>("selection");
    const [isCreating, setIsCreating] = useState(false);
      const { initialized } = useSettingsState();
   const { fetchSettings } = useSettingsApi();

    useEffect(() => {
        if (!initialized) {
            fetchSettings();
        }
    }, [initialized]);

    const handleStartFromScratch = async () => {
        setIsCreating(true);
        try {
            const response = await Api.addons.createOption({
                title: "Untitled Option",
                status: "draft",
            });
            if (response?.success) {
                setAddonBuilderState({ needsRevalidation: true });
                onClose();
                navigate(`/update/${response?.data?.id}`);
            }
        } catch (e) {
            console.error(e);
        }
        setIsCreating(false);
    };

    const handleClose = () => {
        setStep("selection");
        onClose();
    };

    return (
        <>
            {/* Step 1 — Selection modal */}
            <Dialog open={isOpen && step === "selection"} onOpenChange={(v) => !v && handleClose()}>
                <DialogContent className="max-w-[900px] w-full p-0 gap-0 overflow-hidden">
                <DialogHeader className="bg-[var(--opt-header-bg)] p-6">
                </DialogHeader>
                    <div className="text-center">
                        <h2
                            className="text-center"
                            style={{
                                fontSize: '22px',
                                color: 'var(--opt-text-title)',
                                fontWeight: 500,
                                margin: '32px 0 0',
                            }}
                        >
                            {__("How would you like to create your option set?", "optiontics")}
                        </h2>
                        <p className="text-sm text-[var(--opt-text-tertiary)] mt-2 mb-0">
                            {__("Choose one way to get started. You can use AI, select a template, or create everything yourself.", "optiontics")}
                        </p>
                    </div>
                    <div className="grid grid-cols-3 gap-5 p-8">
                        <CreationCard
                            icon={(isHovered) => <OptionTemplateIcon color={isHovered ? "var(--opt-primary)" : "var(--opt-text-icon)"} />}
                            title={__("Select Template", "optiontics")}
                            description={__("Choose a ready-made template for your option set.", "optiontics")}
                            onClick={() => { handleClose(); navigate("/templates-list"); }}
                        />
                        <CreationCard
                            icon={(isHovered) => <OptionCreationIcon color={isHovered ? "var(--opt-primary)" : "var(--opt-text-icon)"} />}
                            title={__("Start from Scratch", "optiontics")}
                            description={__("Create a blank option set and build it your way.", "optiontics")}
                            onClick={handleStartFromScratch}
                            disabled={isCreating}
                        />

                        <CreationCard
                            icon={(isHovered) => <AiBrainIcon isHovered={isHovered} />}
                            title={__("Create with AI", "optiontics")}
                            description={__("Let AI help you build your option set quickly.", "optiontics")}
                            onClick={() => setStep("ai")}
                        />
                    </div>
                </DialogContent>
            </Dialog>

            {/* Step 2A — Build with AI */}
            <If condition={isOpen && step === "ai"}>
                <BuildWithAIModal
                    isOpen={isOpen && step === "ai"}
                    onClose={handleClose}
                    onBack={() => setStep("selection")}
                />
            </If>
        </>
    );
}
