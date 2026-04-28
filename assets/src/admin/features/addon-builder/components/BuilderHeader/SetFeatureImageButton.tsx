/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";
import { useSelect } from "@wordpress/data";

/**
 * External dependencies
 */
import { ImagePlus } from "lucide-react";

/**
 * Internal dependencies
 */
import { stores } from "@/globalConstant";

export const SetFeatureImageButton = () => {
    const { singleOption } = useSelect(
        (select: any) => select(stores?.addons).getAddonBuilderState(),
        [],
    );

    const templateApiActive = !!(window as any).optiontics?.template_api_active;
    const adminUrl          = (window as any).optiontics?.admin_url ?? "/wp-admin/";
    const postId            = singleOption?.id;

    if ( !templateApiActive || !postId ) return null;

    const href = `${adminUrl}post.php?post=${postId}&action=edit`;

    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors no-underline"
        >
            <ImagePlus className="size-4 text-gray-500" />
            {__("Set Feature Image", "optiontics")}
        </a>
    );
};
