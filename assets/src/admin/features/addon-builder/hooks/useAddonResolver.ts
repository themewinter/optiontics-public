import { useMemo } from "@wordpress/element";
import { blockLists } from "../constant";

export const useAddonResolver = () => {
  return useMemo(() => {
    const resolver: Record<string, React.ElementType> = {};

    blockLists.forEach((block) => {
      // Attach Craft metadata if available
      if (block.attributes && block.controls) {
        (block.component as any).craft = {
          displayName: block.attributes.displayName,
          props: block.attributes,
          related: {
            settings: block.controls,
          },
        };
      }

      // Use attribute.type as resolvedName
      const resolvedName = block.attributes?.type;

      if (resolvedName && block.component) {
        resolver[resolvedName] = block.component;
      } else {
        console.warn(
          `⚠️ Block "${block.title}" missing resolvedName (type). Skipping from resolver.`
        );
      }
    });

    return resolver;
  }, [blockLists]);
};
