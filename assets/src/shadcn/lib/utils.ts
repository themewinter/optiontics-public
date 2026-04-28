import { clsx, type ClassValue } from "clsx";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Helper function to show notifications with fallback
 */
export const showNotification = (
    message: string,
    type: "error" | "success" = "error",
) => {
    try {
        // Try to use toast first with a small delay to ensure Toaster is ready
        if (toast && typeof toast[type] === "function") {
            console.log("Using toast notification:", message);
            toast[type](message);
        } else {
            // Fallback to console and alert
            console.error("Toast not available, using fallback:", message);
            alert(message);
        }
    } catch (error) {
        // If toast fails, use fallback
        console.error("Toast error, using fallback:", error);
        alert(message);
    }
};
