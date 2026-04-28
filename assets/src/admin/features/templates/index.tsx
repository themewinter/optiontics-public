/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";

/**
 * Internal dependencies
 */
import { Container } from "@/common/components";

import { PageHeader } from "@/common/components/layouts/PageHeader";
import { TemplateSearch } from "./components/TemplateSearch";
import { TemplateGrid } from "./components/TemplateGrid";
import { PreviewPanel } from "./components/PreviewPanel";
import { useTemplatesPage } from "./hooks/useTemplatesPage";

const TemplatesPage = () => {
    const {
        search,
        setSearch,
        selectedTemplate,
        selectedOptions,
        creatingId,
        filteredTemplates,
        loading,
        error,
        handleSelectTemplate,
        handleUseTemplate,
        handleOptionChange,
        handleBack,
    } = useTemplatesPage();

    return (
        <Container className="space-y-0">
            <PageHeader
                title={__("Optiontics Template", "optiontics")}
                onBack={handleBack}
            />
            <div className="flex flex-col lg:flex-row gap-6 px-8 py-0">
                <div className="flex-1 min-w-0 flex flex-col border border-gray-200 rounded-xl bg-white overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-100 shrink-0">
                        <TemplateSearch
                            value={search}
                            onChange={setSearch}
                        />
                    </div>

                    <div className="p-6 pb-0 overflow-y-auto flex-1" style={{ maxHeight: "calc(100vh - 300px)" }}>
                        <TemplateGrid
                            templates={filteredTemplates}
                            selectedId={selectedTemplate?.id ?? null}
                            creatingId={creatingId}
                            loading={loading}
                            error={error}
                            onSelect={handleSelectTemplate}
                            onUse={handleUseTemplate}
                        />
                    </div>
                </div>

                <div className="w-full max-w-[600px]  xl:max-w-[500px] lg:max-w-[400px] shrink-0 self-stretch">
                    <div className="sticky top-6" style={{ height: "calc(100vh - 180px)" }}>
                        <PreviewPanel
                            template={selectedTemplate}
                            selectedOptions={selectedOptions}
                            onOptionChange={handleOptionChange}
                            onUse={handleUseTemplate}
                            creatingId={creatingId}
                        />
                    </div>
                </div>
            </div>
        </Container>
    );
};

export default TemplatesPage;
