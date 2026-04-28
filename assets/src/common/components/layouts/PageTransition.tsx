/**
 * PageTransition — layout wrapper for route-level enter animations.
 *
 * Renders a keyed div around <Outlet /> so that every navigation
 * causes the incoming page to re-mount and replay the CSS animation.
 * The animation is defined in admin.css as `opt-page-in`.
 */
import { Outlet, useLocation } from "react-router-dom";

export function PageTransition() {
	const location = useLocation();

	return (
		<div key={location.key} className="opt-page-transition">
			<Outlet />
		</div>
	);
}
