/**
 * Optiontics SwitchButton component.
 *
 * Figma dimensions (node I2202:802;4232:30918):
 *   Track  : 44px wide × 24px tall, border-radius 999px
 *   Knob   : 20px × 20px white circle, box-shadow 0 1px 2px rgba(0,0,0,0.15)
 *   Active : bg #2563EB (blue), knob slides to right showing ✓ inside
 *   Inactive: bg #E5E7EB (gray), knob on left showing × inside
 *
 * Both × and ✓ are rendered as ghost marks in the background;
 * the white knob covers and highlights the active side.
 */
import { cn } from "@/shadcn/lib/utils";
import { CheckIcon } from "@/common/icons/CheckIcon";
import { CloseIconSmall } from "@/common/icons/CloseIconSmall";

export interface SwitchButtonProps {
	checked: boolean;
	onChange: (checked: boolean) => void;
	disabled?: boolean;
	className?: string;
}

export function SwitchButton({ checked, onChange, disabled, className }: SwitchButtonProps) {
	return (
		<button
			role="switch"
			type="button"
			aria-checked={checked}
			disabled={disabled}
			onClick={() => !disabled && onChange(!checked)}
			className={cn(
				"relative inline-flex shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out",
				"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1",
				"disabled:pointer-events-none disabled:opacity-50",
				checked
					? "focus-visible:ring-[var(--opt-switch-active)]"
					: "focus-visible:ring-[var(--opt-border)]",
				className,
			)}
			style={{
				width: 44,
				height: 24,
				padding: 2,
				backgroundColor: checked
					? "var(--opt-switch-active)"
					: "var(--opt-switch-inactive)",
			}}
		>
			{/* Background ghost icons — always rendered at both ends of the track */}
			<span
				className="pointer-events-none absolute inset-0 flex items-center justify-between"
				style={{ padding: "2px 4px 2px 2px" }}
				aria-hidden
			>
				{/* Left: × ghost */}
				<span className="flex size-5 items-center justify-center opacity-40">
					<CloseIconSmall
						size={10}
						color={checked ? "#ffffff" : "transparent"}
					/>
				</span>
				{/* Right: ✓ ghost */}
				<span className="flex size-5 items-center justify-center opacity-40">
					<CheckIcon
						size={10}
						color={checked ? "transparent" : "#6b7280"}
					/>
				</span>
			</span>

			{/* Sliding white knob */}
			<span
				className={cn(
					"relative z-10 flex size-5 items-center justify-center rounded-full bg-white",
					"transition-transform duration-200 ease-in-out",
					"shadow-[0px_1px_2px_0px_rgba(0,0,0,0.15)]",
				)}
				style={{
					transform: checked ? "translateX(20px)" : "translateX(0px)",
				}}
			>
				{checked ? (
					<CheckIcon size={10} color="var(--opt-switch-active)" />
				) : (
					<CloseIconSmall size={10} color="#9ca3af" />
				)}
			</span>
		</button>
	);
}
