/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";

/**
 * External dependencies
 */
import { Clock } from "lucide-react";

/**
 * Internal dependencies
 */
import { Empty, EmptyDescription, EmptyTitle, EmptyHeader, EmptyMedia, EmptyContent } from "@/shadcn/components/ui/empty";

/**
 * ComingSoon Component
 *
 * Displays a "Coming Soon" message for features that are not yet available
 * in the addon builder.
 */
export function ComingSoon() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Clock className="size-6 text-muted-foreground" />
        </EmptyMedia>
        <EmptyTitle>
          {__("Coming Soon", "optiontics")}
        </EmptyTitle>
        <EmptyDescription>
          {__(
            "This feature is currently under development and will be available soon. Stay tuned for updates!",
            "optiontics"
          )}
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex gap-2">
        </div>
      </EmptyContent>
    </Empty>
  );
}
