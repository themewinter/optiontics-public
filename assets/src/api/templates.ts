const TEMPLATE_API_URL =
    "https://product.themewinter.com/optiontics-template/wp-json/optiontics/v1/templates";

export interface RemoteTemplate {
    id: number;
    title: string;
    description?: string;
    fields: any[];
    craftData: string | Record<string, any>;
    status: string;
    thumbnail?: string | null;
    preview_url?: string | null;
}

export async function fetchRemoteTemplates(): Promise<RemoteTemplate[]> {
    const res = await fetch(TEMPLATE_API_URL);
    if (!res.ok) {
        throw new Error(`Template API error: ${res.status}`);
    }
    const data = await res.json();
    return Array.isArray(data?.items) ? data.items : [];
}
