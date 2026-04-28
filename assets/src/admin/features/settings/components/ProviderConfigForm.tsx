/**
 * WordPress dependencies
 */
import { useEffect, useMemo, useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";

/**
 * Internal dependencies
 */
import { Button } from "@/shadcn/components/ui/button";
import { Input } from "@/shadcn/components/ui/input";
import { Label } from "@/shadcn/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shadcn/components/ui/select";

import type { AIProviderDefinition, SettingsPayload } from "../types";

interface ProviderConfigFormProps {
    provider: AIProviderDefinition;
    settings: SettingsPayload;
    saving: boolean;
    onSave: (patch: Partial<SettingsPayload>) => Promise<boolean>;
}

export function ProviderConfigForm({
    provider,
    settings,
    saving,
    onSave,
}: ProviderConfigFormProps) {
    const [model, setModel] = useState<string>("");
    const [apiKey, setApiKey] = useState<string>("");

    useEffect(() => {
        const storedModel = provider.modelField
            ? ((settings[provider.modelField] as string | undefined) ?? "")
            : "";
        const storedKey = provider.apiKeyField
            ? ((settings[provider.apiKeyField] as string | undefined) ?? "")
            : "";

        setModel(storedModel || provider.models[0]?.value || "");
        setApiKey(storedKey);
    }, [provider, settings]);

    const activeModel = useMemo(
        () => provider.models.find((m) => m.value === model) ?? null,
        [provider, model],
    );

    const isFormComplete = useMemo(() => {
        const needsModel = provider.models.length > 0;
        const needsApiKey = !!(provider.requiresApiKey || provider.apiKeyField);
        if (needsModel && !model) return false;
        if (needsApiKey && !apiKey.trim()) return false;
        return true;
    }, [provider, model, apiKey]);

    const handleSave = async () => {
        const patch: Partial<SettingsPayload> = {
            ai_active_provider: provider.id,
        };

        if (provider.modelField) {
            patch[provider.modelField] = model;
        }
        if (provider.apiKeyField) {
            patch[provider.apiKeyField] = apiKey.trim();
        }

        await onSave(patch);
    };

    return (
        <div className="space-y-5">
            {provider.models.length > 0 && (
                <div className="space-y-2">
                    <Label htmlFor="opt-ai-model">
                        {__("Select AI Model", "optiontics")}
                    </Label>
                    <Select value={model} onValueChange={setModel}>
                        <SelectTrigger id="opt-ai-model" className="w-full">
                            <SelectValue
                                placeholder={__("Choose a model", "optiontics")}
                            />
                        </SelectTrigger>
                        <SelectContent>
                            {provider.models.map((m) => (
                                <SelectItem key={m.value} value={m.value}>
                                    {m.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {activeModel && (
                        <p className="text-xs text-[var(--opt-text-tertiary)]">
                            {activeModel.description}
                        </p>
                    )}
                </div>
            )}

            {(provider.requiresApiKey || provider.apiKeyField) && (
                <div className="space-y-2">
                    <Label htmlFor="opt-ai-api-key">{provider.apiKeyLabel}</Label>
                    <Input
                        id="opt-ai-api-key"
                        type="password"
                        autoComplete="off"
                        placeholder={__("Enter API key", "optiontics")}
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                    />
                    {provider.apiKeyHelp && (
                        <p className="text-xs text-[var(--opt-text-tertiary)]">
                            {provider.apiKeyHelp}{" "}
                            {provider.helpLink && (
                                <a
                                    href={provider.helpLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="underline font-semibold hover:text-primary hover:opacity-80"
                                >
                                    {__("Get API Key", "optiontics")}
                                </a>
                            )}
                        </p>
                    )}
                </div>
            )}

            <div className="flex justify-end">
                <Button type="button" onClick={handleSave} disabled={saving || !isFormComplete}>
                    {saving
                        ? __("Saving…", "optiontics")
                        : __("Save Configuration", "optiontics")}
                </Button>
            </div>
        </div>
    );
}
