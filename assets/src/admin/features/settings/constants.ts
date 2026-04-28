/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";

/**
 * Internal dependencies
 */
import type { AIProviderDefinition } from "./types";

export const AI_PROVIDERS: AIProviderDefinition[] = [
    {
        id: "free_token",
        name: __("Free Token", "optiontics"),
        description: __("Free AI-powered assistant — no credit card required.", "optiontics"),
        requiresApiKey: false,
        models: [],
        apiKeyLabel: __("Free Token API Key", "optiontics"),
        apiKeyField: "optiontics_openrouter_api_key",
        apiKeyHelp: __(
            "Enter your Free Token API key to enable AI-powered features. Create a free account to generate your key.",
            "optiontics",
        ),
        helpLink: "https://app.aisentic.com/register",
    },
    {
        id: "google_gemini",
        name: __("Google Gemini", "optiontics"),
        description: __("Google's multimodal AI — ideal for complex reasoning and rich content.", "optiontics"),
        requiresApiKey: true,
        apiKeyField: "ai_google_gemini_api_key",
        modelField: "ai_google_gemini_model",
        apiKeyLabel: __("Google API Key", "optiontics"),
        apiKeyHelp: __(
            "Enter your Google API key to enable Gemini models. You can generate a key from Google AI Studio.",
            "optiontics",
        ),
        helpLink: "https://ai.google.com/studio/",
        models: [
            {
                value: "gemini-3.1-pro",
                label: __("Gemini 3.1 Pro", "optiontics"),
                description: __(
                    "Frontier intelligence for complex reasoning and agentic tasks.",
                    "optiontics",
                ),
            },
            {
                value: "gemini-2.5-flash",
                label: __("Gemini 2.5 Flash", "optiontics"),
                description: __(
                    "Faster, cost-efficient model for everyday prompts.",
                    "optiontics",
                ),
            },
        ],
    },
    {
        id: "openai",
        name: __("OpenAI", "optiontics"),
        description: __("OpenAI's powerful GPT models — reliable and versatile for any task.", "optiontics"),
        requiresApiKey: true,
        apiKeyField: "ai_openai_api_key",
        modelField: "ai_openai_model",
        apiKeyLabel: __("OpenAI API Key", "optiontics"),
        apiKeyHelp: __(
            "Enter your OpenAI API key to enable GPT models. You can find or create your key in the OpenAI Platform dashboard.",
            "optiontics",
        ),
        helpLink: "https://platform.openai.com/",
        models: [
            {
                value: "gpt-5.2",
                label: __("GPT-5.2", "optiontics"),
                description: __(
                    "Best general-purpose & agentic model with fast responses",
                    "optiontics",
                ),
            },
            {
                value: "gpt-4o",
                label: __("GPT-4o", "optiontics"),
                description: __(
                    "Balanced model for everyday production workloads.",
                    "optiontics",
                ),
            },
        ],
    },
];
