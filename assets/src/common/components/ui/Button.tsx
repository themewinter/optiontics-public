/**
 * Optiontics design-system Button component.
 * Colours/radius sourced from Figma: figma.com/design/nWIIize4Oj2McU7L4VAUdE node 2200-183.
 */
import type { ButtonHTMLAttributes, ReactNode } from "@wordpress/element";
import { cn } from "@/shadcn/lib/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: "primary" | "secondary" | "ghost";
	size?: "sm" | "md";
	/** Optional icon rendered to the left of children */
	icon?: ReactNode;
}

/**
 * primary  — bg #4A3BD6, white text, hover darken (Figma: Add Options)
 * secondary — white bg, 1px border #CBD8EA, text #374151, hover #F3F4F6
 * ghost    — no border / no bg, text #6D6D6D, hover text #0B1420
 */
export function Button({
	variant = "primary",
	size = "md",
	icon,
	children,
	className,
	disabled,
	...props
}: ButtonProps) {
	const base =
		"inline-flex items-center justify-center gap-2 font-medium rounded-[6px] transition-colors duration-150 cursor-pointer select-none disabled:pointer-events-none disabled:opacity-50 whitespace-nowrap";

	const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
		primary:
			"bg-[var(--opt-primary)] text-white hover:bg-[var(--opt-primary-hover)] active:bg-[var(--opt-primary-hover)]",
		secondary:
			"bg-white border border-[var(--opt-border)] text-[#374151] hover:bg-[var(--opt-secondary-soft)]",
		ghost: "bg-transparent text-[var(--opt-text-tertiary)] hover:text-[var(--opt-text-default)]",
	};

	const sizes: Record<NonNullable<ButtonProps["size"]>, string> = {
		md: "h-11 px-6 text-sm",
		sm: "h-9 px-3 text-sm",
	};

	return (
		<button
			className={cn(base, variants[variant], sizes[size], className)}
			disabled={disabled}
			{...props}
		>
			{icon !== undefined && <span className="shrink-0 flex items-center">{icon}</span>}
			{children}
		</button>
	);
}
