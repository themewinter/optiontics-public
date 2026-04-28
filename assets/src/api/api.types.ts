type ApiResponse = {
    success?: 0 | 1;
    message?: string;
    [key: string]: any;
};

type NotifyParams = {
    res: ApiResponse;
    method: string;
};

type SendRequestParams = {
    path?: string;
    method?: string;
    data?: Record<string, any>;
    showToast?: boolean;
};
