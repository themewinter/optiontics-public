/**
 * Wordpress Dependencies
 */
import { __ } from "@wordpress/i18n";

/**
 * Internal Dependencies
 */
import { Description } from "@/common/components";

export const ErrorInstructions = () => {
    return (
        <div className="flex flex-col gap-2 items-center">
            <Description>
                {__(
                    "If you’re seeing this unexpectedly, try refreshing the page:",
                    "optiontics",
                )}
            </Description>
            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <span role="img" aria-label="window emoji">
                        🪟
                    </span>
                    <strong className="font-semibold">
                        {__("Windows:", "optiontics")}
                    </strong>
                    <code className="bg-gray-100 px-2 py-1 rounded">
                        {"Ctrl + Shift + R"}
                    </code>
                </div>
                <div className="flex items-center gap-2">
                    <span role="img" aria-label="apple emoji">
                        🍎
                    </span>
                    <strong className="font-semibold">
                        {__("Mac:", "optiontics")}
                    </strong>
                    <code className="bg-gray-100 px-2 py-1 rounded">
                        {"Cmd + Shift + R"}
                    </code>
                </div>
            </div>
        </div>
    );
};
