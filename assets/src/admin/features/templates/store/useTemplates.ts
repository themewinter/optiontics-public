/**
 * WordPress dependencies
 */
import { useDispatch, useSelect } from "@wordpress/data";

/**
 * Internal dependencies
 */
import { stores } from "@/globalConstant";
import { fetchRemoteTemplates } from "@/api/templates";
// Side-effect import — ensures the templates store is registered before any hook uses it.
import "./index";

export function useTemplatesApi() {
    const { setTemplatesState } = useDispatch(stores.templates);

    const fetchTemplates = async () => {
        setTemplatesState({ loading: true, error: null });
        try {
            const items = await fetchRemoteTemplates();
            setTemplatesState({ templates: items, error: null });
        } catch {
            setTemplatesState({ error: true });
        } finally {
            setTemplatesState({ loading: false });
        }
    };

    return { fetchTemplates };
}

export function useTemplatesState() {
    return useSelect(
        (select: any) => select(stores.templates).getTemplatesState(),
        []
    );
}
