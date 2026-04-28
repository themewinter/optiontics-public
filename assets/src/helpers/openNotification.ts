/**
 * External dependencies
 */
import { toast } from "sonner";

export const openNotification = (data: {
    type: "success" | "error" | "info" | "warning" | "loading";
    message: string;
}) => {
    const { type, message } = data;

    toast[type](message);
};
