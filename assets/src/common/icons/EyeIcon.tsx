interface IconProps {
    size?: number;
    color?: string;
    className?: string;
}

export function EyeIcon({
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
                d="M17.9546 9.20449C18.208 9.55974 18.3346 9.73741 18.3346 10.0003C18.3346 10.2632 18.208 10.4409 17.9546 10.7962C16.8162 12.3925 13.909 15.8337 10.0013 15.8337C6.09362 15.8337 3.18639 12.3925 2.048 10.7962C1.79464 10.4409 1.66797 10.2632 1.66797 10.0003C1.66797 9.73741 1.79464 9.55974 2.048 9.20449C3.18639 7.60819 6.09362 4.16699 10.0013 4.16699C13.909 4.16699 16.8162 7.60819 17.9546 9.20449Z"
                stroke={color}
                stroke-width="1.25"
            />
            <path
                d="M12.5 10C12.5 8.61925 11.3807 7.5 10 7.5C8.61925 7.5 7.5 8.61925 7.5 10C7.5 11.3807 8.61925 12.5 10 12.5C11.3807 12.5 12.5 11.3807 12.5 10Z"
                stroke={color}
                stroke-width="1.25"
            />
        </svg>
    );
}
