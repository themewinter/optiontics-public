interface IconProps {
	size?: number;
	color?: string;
	className?: string;
}

export function EditIcon({ size = 20, color = "currentColor", className }: IconProps) {
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
                d="M13.6848 3.83757L14.5098 3.01258C15.1933 2.32914 16.3014 2.32914 16.9848 3.01258C17.6682 3.69603 17.6682 4.80411 16.9848 5.48756L16.1598 6.31255M13.6848 3.83757L8.13538 9.387C7.71245 9.81 7.41243 10.3398 7.26737 10.9201L6.66406 13.3333L9.07731 12.73C9.65756 12.585 10.1874 12.2849 10.6104 11.862L16.1598 6.31255M13.6848 3.83757L16.1598 6.31255"
                stroke={color}
                strokeWidth="1.25"
                strokeLinejoin="round"
            />
            <path
                d="M15.8333 11.2503C15.8333 13.9899 15.8332 15.3597 15.0767 16.2817C14.9382 16.4504 14.7834 16.6052 14.6146 16.7437C13.6927 17.5003 12.3228 17.5003 9.58325 17.5003H9.16667C6.02397 17.5003 4.45263 17.5003 3.47632 16.524C2.50002 15.5477 2.5 13.9763 2.5 10.8337V10.417C2.5 7.67743 2.5 6.30765 3.25662 5.38569C3.39514 5.21691 3.54992 5.06213 3.7187 4.92361C4.64066 4.16699 6.01043 4.16699 8.75 4.16699"
                stroke={color}
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
	);
}
