/**
 * WordPress dependencies
 */
/**
 * Internal dependencies
 */
import { useAddonResolver } from "./hooks/useAddonResolver";
import { useBuilderInit } from "./hooks/useBuilderInit";
import { EditorWrapper } from "./components/BuilderLayout/EditorWrapper";
import EditorSkeleton from "./components/EditorSkeleton";
import { useBuilderActiveEffect } from "@/admin/hooks/useBuilderActiveEffect";

const AddonBuilder = () => {
  const resolverList = useAddonResolver();
  const { singleOption } = useBuilderInit();

  useBuilderActiveEffect();

  if (!singleOption) {
    return <EditorSkeleton />;
  }

  return <EditorWrapper resolver={resolverList} />;
};

export default AddonBuilder;
