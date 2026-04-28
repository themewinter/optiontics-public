/**
 * WordPress Dependencies
 */
import { useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";

/**
 * External Dependencies
 */
import { Loader2Icon } from "lucide-react";

/**
 * Internal Dependencies
 */
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/shadcn/components/ui/alert-dialog";
import { Button } from "@/shadcn/components/ui";

interface DeleteConfirmationDialogProps {
    onConfirm: () => void | Promise<void>;
    trigger: React.ReactNode;
    title?: string;
    description?: string;
    deleteBtnText?: string;
}

export const DeleteConfirmationDialog = ({
    onConfirm,
    trigger,
    title = __("Are you sure?", "optiontics"),
    description = __(
        "This action cannot be undone. This will permanently delete the item.",
        "optiontics",
    ),
    deleteBtnText = __("Delete", "optiontics"),
}: DeleteConfirmationDialogProps) => {
    const [open, setOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleConfirm = async () => {
        try {
            setIsDeleting(true);

            // Handle both sync and async operations
            const result = onConfirm();

            // If it's a Promise (async operation), await it
            if (result instanceof Promise) {
                await result;
            }

            // Close dialog after operation completes
            setOpen(false);
        } catch (error) {
            console.error("Delete operation failed:", error);
            // Keep dialog open on error so user can retry
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
            <AlertDialogContent className="border-neutral-200">
                <AlertDialogHeader>
                    <AlertDialogTitle className="my-0!">
                        {title}
                    </AlertDialogTitle>
                    <AlertDialogDescription className="my-0!">
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="opt-alert-dialog-footer">
                    <AlertDialogCancel disabled={isDeleting}>
                        {__("Cancel", "optiontics")}
                    </AlertDialogCancel>
                    <Button
                        onClick={handleConfirm}
                        className="bg-danger hover:bg-danger/80 text-white"
                        disabled={isDeleting}
                    >
                        {isDeleting && <Loader2Icon className="animate-spin" />}
                        {deleteBtnText}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

// If this module is evaluated more than once, prevent duplicate registrations.
window?.wp?.hooks?.removeFilter?.(
    "optiontics_delete_confirmation_dialog",
    "optiontics",
);

window?.wp?.hooks?.addFilter?.(
    "optiontics_delete_confirmation_dialog",
    "optiontics",
    (_, props) => <DeleteConfirmationDialog {...props} />,
    10,
);
