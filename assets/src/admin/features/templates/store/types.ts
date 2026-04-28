import type { RemoteTemplate } from "@/api/templates";

export interface TemplatesState {
    templates: RemoteTemplate[];
    loading: boolean;
    error: boolean | null;
}

export const initialState: TemplatesState = {
    templates: [],
    loading: false,
    error: null,
};