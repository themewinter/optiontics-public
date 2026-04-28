/**
 * Flat key/value shape for settings stored via Optiontics\Core\Settings\Settings.
 * Every field is optional — the REST endpoint merges partials.
 */
export interface SettingsPayload {
    ai_active_provider?: AIProviderId | "";
    ai_google_gemini_model?: string;
    ai_google_gemini_api_key?: string;
    ai_openai_model?: string;
    ai_openai_api_key?: string;
    [key: string]: unknown;
}

export type AIProviderId = "free_token" | "google_gemini" | "openai";

export interface AIModelOption {
    value: string;
    label: string;
    description: string;
}

export interface AIProviderDefinition {
    id: AIProviderId;
    name: string;
    description: string;
    requiresApiKey: boolean;
    apiKeyField?: keyof SettingsPayload;
    modelField?: keyof SettingsPayload;
    apiKeyLabel?: string;
    apiKeyHelp?: string;
    helpLink?: string;
    models: AIModelOption[];
}

export type SettingsTabId = "ai" | "integrations";
