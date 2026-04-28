interface IconProps {
	size?: number;
	color?: string;
	className?: string;
}

/** Small close/× icon — used inside the SwitchButton knob (10px default). */
export function CloseIconSmall({ size = 10, color = "currentColor", className }: IconProps) {
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
				d="M2 2L8 8M8 2L2 8"
				stroke={color}
				strokeWidth="1.5"
				strokeLinecap="round"
			/>
		</svg>
	);
}
