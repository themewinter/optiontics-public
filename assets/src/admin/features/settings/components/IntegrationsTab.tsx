/**
 * External dependencies
 */
import { PlugIcon } from "lucide-react";

/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";

/**
 * Internal dependencies
 */
import { Card, CardContent } from "@/shadcn/components/ui/card";

export function IntegrationsTab() {
    return (
        <Card className="border-[var(--opt-border)]">
            <CardContent className="flex flex-col items-center justify-center gap-3 p-10 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                    <PlugIcon size={22} />
                </div>
                <h3 className="text-base font-semibold text-[var(--opt-text-default)]">
                    {__("Integrations coming soon", "optiontics")}
                </h3>
                <p className="max-w-md text-sm text-[var(--opt-text-tertiary)]">
                    {__(
                        "Third-party integrations will be configured from this panel. WooCommerce and Dokan are wired up automatically — no setup needed here.",
                        "optiontics",
                    )}
                </p>
            </CardContent>
        </Card>
    );
}
