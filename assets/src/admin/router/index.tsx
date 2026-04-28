/**
 * Wordpress Dependencies
 */
import { FC, lazy } from "@wordpress/element";

/**
 * External Dependencies
 */
import {
    createHashRouter,
    Outlet,
    useNavigate,
    useParams,
    useSearchParams,
} from "react-router-dom";

/**
 * Internal Dependencies
 */
import NotFound from "@/admin/router/NotFound";
import { ErrorPage } from "@/common/components";
import { PageTransition } from "@/common/components/layouts/PageTransition";
import { ADDON_EDIT_PATH, ADDON_LIST_PATH, ANALYTICS_PATH, TEMPLATES_PATH, ABOUT_US_PATH, SETTINGS_PATH } from "./routeDefinition";

const AddonList = lazy(() => import("@/admin/features/addon-list")) as FC;
const EditAddon = lazy(
    () => import("@/admin/features/addon-builder"),
) as unknown as FC;
const TemplatesPage = lazy(
    () => import("@/admin/features/templates"),
) as unknown as FC;
const AboutUs = lazy(
    () => import("@/admin/features/about-us"),
) as unknown as FC;
const AnalyticsPage = lazy(
    () => import("@/admin/features/analytics"),
) as unknown as FC;
const SettingsPage = lazy(
    () => import("@/admin/features/settings"),
) as unknown as FC;
const { applyFilters } = wp.hooks;

// Flat list of page routes — this is what filters extend.
const routerChildren = [
    {
        path: ADDON_LIST_PATH,
        element: <AddonList />,
    },
    {
        path: ADDON_EDIT_PATH,
        element: <EditAddon />,
        errorElement: <ErrorPage />,
    },
    {
        path: TEMPLATES_PATH,
        element: <TemplatesPage />,
    },
    {
        path: ABOUT_US_PATH,
        element: <AboutUs />,
    },
    {
        path: ANALYTICS_PATH,
        element: <AnalyticsPage />,
    },
    {
        path: SETTINGS_PATH,
        element: <SettingsPage />,
    },
    {
        path: "*", // catch-all
        element: <NotFound />,
    },
];

const filteredChildren = applyFilters("optiontics_router", routerChildren, {
    Outlet,
    useNavigate,
    useSearchParams,
    useParams,
    ErrorPage,
});

// Wrap all routes (including filter-added ones) in the transition layout.
const router = createHashRouter([
    {
        element: <PageTransition />,
        children: filteredChildren,
    },
]);

export default router;
