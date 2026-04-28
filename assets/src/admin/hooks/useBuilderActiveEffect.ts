import { useEffect } from "@wordpress/element";

const isDokan =
    typeof window !== "undefined" &&
    (window as any).optiontics?.option_tics_multivendor === "1";

export function useBuilderActiveEffect() {
    useEffect(() => {
        if (isDokan) {
            const toggleBtn = document.querySelector<HTMLButtonElement>(
                'button[aria-label="Toggle sidebar menu"]'
            );
            const sidebar = document.querySelector<HTMLElement>(".dokan-frontend-sidebar");
            const isExpanded = sidebar?.classList.contains("w-[250px]");

            if (toggleBtn && isExpanded) toggleBtn.click();

            return () => {
                const isCollapsed = sidebar?.classList.contains("w-24");
                if (toggleBtn && isCollapsed) toggleBtn.click();
            };
        }

        document.documentElement.classList.add("optiontics-builder-active");
        return () => {
            document.documentElement.classList.remove("optiontics-builder-active");
        };
    }, []);
}
