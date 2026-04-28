/**
 * WordPress dependencies
 */
import { useState, useEffect } from "@wordpress/element";
import { useBuilderActiveEffect } from "@/admin/hooks/useBuilderActiveEffect";

/**
 * External dependencies
 */
import { useNavigate } from "react-router-dom";

/**
 * Internal dependencies
 */
import { type RemoteTemplate } from "@/api/templates";
import Api from "@/api";
import { useTemplatesApi, useTemplatesState } from "../store/useTemplates";

function parseCraftData(
  craftData: RemoteTemplate["craftData"]
): Record<string, any> | null {
  if (!craftData) return null;
  if (typeof craftData === "string") {
    try {
      return JSON.parse(craftData);
    } catch {
      return null;
    }
  }
  return craftData as Record<string, any>;
}

export function useTemplatesPage() {
  const navigate = useNavigate();
  const { fetchTemplates } = useTemplatesApi();
  const { templates, loading, error } = useTemplatesState();

  const [search, setSearch] = useState("");
  const [selectedTemplate, setSelectedTemplate] =
    useState<RemoteTemplate | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >({});
  const [creatingId, setCreatingId] = useState<number | null>(null);

  useBuilderActiveEffect();

  useEffect(() => {
    if (templates?.length) return;
    fetchTemplates();
  }, []);

  const filteredTemplates = (templates ?? []).filter((t: RemoteTemplate) =>
    t.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectTemplate = (template: RemoteTemplate) => {
    setSelectedTemplate(template);
  };

  const handleUseTemplate = async (template: RemoteTemplate) => {
    setCreatingId(template.id);
    try {
      const craftData = parseCraftData(template.craftData);
      const response = await Api.addons.createOption({
        title: template.title,
        status: "draft",
        fields: template.fields ?? [],
        craftData
      });
      if (response?.success) {
        navigate(`/update/${response?.data?.id}`);
      }
    } catch (e) {
      console.error(e);
    }
    setCreatingId(null);
  };

  const handleViewDemo = (_template: RemoteTemplate) => {
    // window.open(_template.image, "_blank", "noopener,noreferrer");
  };

  const handleOptionChange = (key: string, value: string) => {
    setSelectedOptions((prev) => ({ ...prev, [key]: value }));
  };

  const handleBack = () => navigate("/");

  return {
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
    handleViewDemo,
    handleOptionChange,
    handleBack
  };
}
