import { createContext, useContext } from "@wordpress/element";

const ShadowContainerContext = createContext<HTMLElement | null>(null);

export const useShadowContainer = () => useContext(ShadowContainerContext);
export default ShadowContainerContext;
