interface IconProps {
	size?: number;
	color?: string;
	className?: string;
}

export function CheckIcon({ size = 10, color = "currentColor", className }: IconProps) {
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 10 10"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={className}
		>
			<path
				d="M1.5 5.5L3.5 7.5L8.5 2.5"
				stroke={color}
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}
