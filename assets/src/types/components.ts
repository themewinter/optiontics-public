export interface TopHeaderProps {
    title?: string;
    rightContent?: React.ReactNode;
    goBack?: () => void;
}

export interface MenuItemProps {
    label: string;
    icon?: React.ComponentType<{ className?: string }>;
    tab: string;
    children?: MenuItemProps[];
    content?: React.ReactNode;
}

export interface NavTabMenuProps {
    menu: MenuItemProps[];
}

export interface UploadMediaProps {
    fileUrl?: string; // Works for audio, image, video, etc.
    setFileUrl: (url: string | false) => void;
    setFileId?: (id?: number) => void;
    cacheKey?: string; // Unique key for media frame caching per field
}
