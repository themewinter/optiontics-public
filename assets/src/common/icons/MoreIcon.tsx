interface IconProps {
    size?: number;
    color?: string;
    className?: string;
}

export function MoreIcon({
    size = 20,
    color = "currentColor",
    className,
}: IconProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
			className={className}
        >
            <path
                d="M10.0052 9.58301C10.4655 9.58301 10.8385 9.95609 10.8385 10.4163C10.8385 10.8766 10.4655 11.2497 10.0052 11.2497C9.54496 11.2497 9.17188 10.8766 9.17188 10.4163C9.17188 9.95609 9.54496 9.58301 10.0052 9.58301Z"
                stroke={color}
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M15.0052 9.58301C15.4655 9.58301 15.8385 9.95609 15.8385 10.4163C15.8385 10.8766 15.4655 11.2497 15.0052 11.2497C14.545 11.2497 14.1719 10.8766 14.1719 10.4163C14.1719 9.95609 14.545 9.58301 15.0052 9.58301Z"
                stroke={color}
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M5.00521 9.58301C5.46544 9.58301 5.83854 9.95609 5.83854 10.4163C5.83854 10.8766 5.46544 11.2497 5.00521 11.2497C4.54497 11.2497 4.17188 10.8766 4.17188 10.4163C4.17188 9.95609 4.54497 9.58301 5.00521 9.58301Z"
                stroke={color}
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}
