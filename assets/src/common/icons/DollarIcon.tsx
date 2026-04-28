interface IconProps {
	size?: number;
	color?: string;
	className?: string;
}

export function DollarIcon({ size = 20, color = "currentColor", className }: IconProps) {
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="none"
			stroke={color}
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			xmlns="http://www.w3.org/2000/svg"
			className={className}
		>
			<line x1="12" y1="1" x2="12" y2="23" />
			<path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
		</svg>
	);
}
