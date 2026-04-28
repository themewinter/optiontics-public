/**
 * WordPress dependencies
 */
import { useNavigate } from "react-router-dom";

/**
 * Internal dependencies
 */
import { ADDON_LIST_PATH } from "@/admin/router/routeDefinition";
import { Button } from "@/shadcn/components/ui";
import { ExitIcon } from "@/common/icons";

export const NavigationSection = () => {
    const navigate = useNavigate();

    return (
        <Button
            variant="ghost"
            size="icon"
            className="opt-builder-back-btn text-gray-600 hover:text-gray-900"
            onClick={() => navigate(ADDON_LIST_PATH)}
        >
            <ExitIcon />
        </Button>
    );
};
