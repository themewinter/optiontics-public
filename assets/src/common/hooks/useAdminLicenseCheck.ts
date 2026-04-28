export const useAdminLicenseCheck = () => {
    const isProActivated = Boolean(
        (process.env.NODE_ENV === "development" && window.optionticsPro) ||
            window.optionticsPro,
    );

    return isProActivated;
};
