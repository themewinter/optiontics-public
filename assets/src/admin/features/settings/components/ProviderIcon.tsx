/**
 * External dependencies
 */
import { BotIcon } from "lucide-react";

/**
 * Internal dependencies
 */
import type { AIProviderId } from "../types";

function FreeTokenIcon() {
    return (
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-white">
            <BotIcon size={20} />
        </div>
    );
}

function GoogleGeminiIcon() {
    return (
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white ring-1 ring-slate-200">
            <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
            >
                <defs>
                    <linearGradient
                        id="opt-gemini-grad"
                        x1="0"
                        y1="0"
                        x2="24"
                        y2="24"
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop offset="0" stopColor="#1C7EFE" />
                        <stop offset="0.5" stopColor="#9068F8" />
                        <stop offset="1" stopColor="#FF4A7D" />
                    </linearGradient>
                </defs>
                <path
                    d="M12 0c.4 5.4 6.6 11.6 12 12-5.4.4-11.6 6.6-12 12-.4-5.4-6.6-11.6-12-12C5.4 11.6 11.6 5.4 12 0z"
                    fill="url(#opt-gemini-grad)"
                />
            </svg>
        </div>
    );
}

function OpenAIIcon() {
    return (
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white ring-1 ring-slate-200">
            <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="#111827"
                aria-hidden="true"
            >
                <path d="M22.28 9.82a5.43 5.43 0 00-.47-4.46 5.51 5.51 0 00-5.94-2.65A5.51 5.51 0 007.71 1.83a5.43 5.43 0 00-3.62 2.64 5.5 5.5 0 00-3.67 2.66 5.5 5.5 0 00.68 6.45 5.5 5.5 0 00.47 4.46 5.5 5.5 0 005.94 2.65 5.5 5.5 0 004.15 1.85 5.5 5.5 0 005.25-3.81 5.5 5.5 0 003.66-2.66 5.5 5.5 0 00-.68-6.45zm-8.2 11.49a4.07 4.07 0 01-2.62-.95l.13-.07 4.38-2.53a.71.71 0 00.36-.62v-6.18l1.85 1.07a.07.07 0 01.04.06v5.12a4.1 4.1 0 01-4.14 4.1zm-8.82-3.77a4.08 4.08 0 01-.49-2.74l.13.08 4.38 2.53a.71.71 0 00.72 0l5.35-3.09v2.14a.07.07 0 01-.03.06l-4.43 2.56a4.11 4.11 0 01-5.63-1.54zM4.1 7.38a4.08 4.08 0 012.14-1.8v5.22a.71.71 0 00.36.62l5.34 3.08-1.85 1.07a.07.07 0 01-.06 0L5.58 13A4.1 4.1 0 014.1 7.38zm15.19 3.55l-5.35-3.11 1.85-1.07a.07.07 0 01.06 0l4.43 2.56a4.1 4.1 0 01-.62 7.4v-5.22a.73.73 0 00-.37-.56zm1.84-2.77l-.13-.08-4.36-2.54a.72.72 0 00-.72 0l-5.35 3.09V6.5a.07.07 0 01.03-.06l4.43-2.55a4.1 4.1 0 016.1 4.25zm-11.6 3.8L7.68 11a.07.07 0 01-.04-.06V5.8a4.1 4.1 0 016.75-3.15l-.13.08-4.38 2.53a.71.71 0 00-.36.62zm1-2.17L13 8.35l2.39 1.37v2.75L13 13.85l-2.39-1.37z" />
            </svg>
        </div>
    );
}

export function ProviderIcon({ id }: { id: AIProviderId }) {
    switch (id) {
        case "free_token":
            return <FreeTokenIcon />;
        case "google_gemini":
            return <GoogleGeminiIcon />;
        case "openai":
            return <OpenAIIcon />;
    }
}
