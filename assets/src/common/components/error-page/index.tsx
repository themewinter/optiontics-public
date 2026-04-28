/**
 * Wordpress Dependencies
 */
import { __ } from "@wordpress/i18n";

/**
 * Internal Dependencies
 */
import { ErrorInstructions } from "@/common/components/ErrorInstructions";
import { ErrorIcon } from "@/common/icons";
import { Button } from "@/shadcn/components/ui/button";
import ErrorBoundary from "./ErrorBoundary";

export { ErrorBoundary };

export const ErrorPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
            <div className="bg-white flex flex-col items-center justify-center dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md p-8 space-y-2">
                <ErrorIcon width="60" height="60" />
                <div className="text-xl font-semibold text-gray-800 dark:text-white">
                    {__("Ooops! Something's Wrong. ", "optiontics")}
                </div>
                <div className="text-gray-600 dark:text-gray-300">
                    {__(
                        "Please try again or let us know if the issue's still here.",
                        "optiontics",
                    )}
                </div>
                <ErrorInstructions />
                <Button onClick={() => location.reload()}>
                    {__("Try Again", "optiontics")}
                </Button>
            </div>
        </div>
    );
};
