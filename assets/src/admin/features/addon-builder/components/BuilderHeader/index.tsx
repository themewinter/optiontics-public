/**
 * Internal dependencies
 */
import { ActionsSection } from "./ActionsSection";
import { CategoryEditSection } from "./CategoryEditSection";
import { NavigationSection } from "./NavigationSection";
import { TitleEditSection } from "./TitleEditSection";
import { SetFeatureImageButton } from "./SetFeatureImageButton";

const BuilderHeader = () => {
    return (
        <div className="bg-white border-b border-gray-200 px-3 md:px-6 py-3 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
                <NavigationSection />
                <TitleEditSection />
            </div>
            <CategoryEditSection />
            <div className="flex items-center gap-2">
                <SetFeatureImageButton />
                <ActionsSection />
            </div>
        </div>
    );
};

export default BuilderHeader;
