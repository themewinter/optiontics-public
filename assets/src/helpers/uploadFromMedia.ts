/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";

type UploadOptions = {
    title: string;
    buttonText?: string;
    libraryType: string[];
    mimeCheck: (mime?: string) => boolean;
    cacheKey: string; // Unique key for caching uploader instance
    allowedMime?: string | string[]; // Restrict media frame to these mime types (e.g. 'image/svg+xml')
};

/**
 * Open WordPress media uploader with generic setters
 */
export const uploadFromMedia = (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    setFileUrl: (url: string) => void,
    options: UploadOptions,
    setFileId?: (id: number) => void,
): void => {
    event.preventDefault();

    const { title, buttonText, libraryType, mimeCheck, cacheKey, allowedMime } =
        options;

    if (!window.wp?.media) {
        console.error("WordPress media library is not available");
        return;
    }

    let mediaUploader: ReturnType<NonNullable<Window["wp"]>["media"]>;

    // Reuse or create media frame. We don't early-return so we can rebind the select handler per field instance.
    if ((window as any)[cacheKey]) {
        mediaUploader = (window as any)[cacheKey];
    } else {
        mediaUploader = (window as any)[cacheKey] = window.wp.media({
            title: __(title, "optiontics"),
            button: {
                text: __(buttonText || title, "optiontics"),
            },
            library: {
                type: libraryType,
            },
            multiple: false,
        });
    }

    // When frame opens, refine the query to only allowedMime if provided.
    if (allowedMime) {
        mediaUploader.on("open", () => {
            const library: any = mediaUploader.state().get("library");
            if (
                library &&
                library.props &&
                typeof library.props.set === "function"
            ) {
                library.props.set("type", allowedMime);
                library.props.set("query", true);
                if (typeof library.more === "function") {
                    library.more();
                }
            }
        });
    }

    // Manage select handler to avoid duplicates: store reference on frame instance.
    const handlerKey = `__optiontics_select_handler_${cacheKey}`;
    // Track latest invocation id to prevent stale handlers from updating other fields.
    const invocationId = Date.now();
    (mediaUploader as any)[handlerKey + "_latest"] = invocationId;
    const selectHandler = () => {
        if ((mediaUploader as any)[handlerKey + "_latest"] !== invocationId) {
            return; // A newer handler was registered
        }
        const selection = mediaUploader.state().get("selection");
        if (selection.length > 0) {
            const selectedFile = selection.first().toJSON() as {
                url: string;
                id: number;
                mime?: string;
            };

            if (mimeCheck(selectedFile.mime)) {
                setFileUrl(selectedFile.url);
                if (setFileId) setFileId(selectedFile.id);
            } else {
                alert(__("Please select a valid file.", "optiontics"));
            }
        }
    };
    mediaUploader.on("select", selectHandler);
    (mediaUploader as any)[handlerKey] = selectHandler; // kept for potential future cleanup

    mediaUploader.open();
};
