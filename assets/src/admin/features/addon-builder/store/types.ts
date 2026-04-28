export type AddonBuilderState = {
    collapsed: boolean;
    themeColor: string;
    title: string;
    category: string;
    isEditingTitle: boolean;
    isEditingCategory: boolean;
    searchQuery: AddonListSearchQuery;
    isFiltering: boolean;
    singleOption: any;
    activeTab: string;
    activeTabContent?: React.ReactNode | null;
    
    addonList: {
        id: number;
        name: string;
        description: string;
        price: number;
        image: string;
        category: string;
        fields: any;
        craftData: any;
    }[];

    selectedProductType:string | null;
    selectedProduct:string | null;
    excludedProducts:string[] | null;
    total: number;
    updatingOption: number | null;
    needsRevalidation: boolean;
    error: string | null;
    [key: string]: any | null;
};

export interface AddonListSearchQuery {
    paged?: number;
    per_page?: number;
    search?: string;
    status?: string;
}