type ToastType = "info" | "success" | "error" | "warning" | "loading";

interface NotificationOptions {
    type?: ToastType;
    message: string;
}
