/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";

/**
 * External dependencies
 */
import { LayoutTemplate } from "lucide-react";

/**
 * Internal dependencies
 */
import withControl from "../../components/Controls/withControl";
import { ControlGeneratorProps } from "../../types";
import {
    Empty,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
    EmptyDescription,
} from "@/shadcn/components/ui/empty";

type BlockProps = {
    background: { r: number; g: number; b: number; a: number };
    color: { r: number; g: number; b: number; a: number };
    minHeight: number;
    minWidth: number;
    width: { size: number; unit: string };
    displayName: string;
    children: React.ReactNode;
    [key: string]: any;
};

function Controls(_props: ControlGeneratorProps<BlockProps>) {
    return (
        <Empty className="border border-dashed border-gray-200">
            <EmptyHeader>
                <EmptyMedia variant="icon">
                    <LayoutTemplate className="size-6 text-muted-foreground" />
                </EmptyMedia>
                <EmptyTitle>
                    {__("Nothing to configure here", "optiontics")}
                </EmptyTitle>
                <EmptyDescription>
                    {__(
                        "The Body is the canvas for your form. Add or select an element inside it to edit its properties.",
                        "optiontics",
                    )}
                </EmptyDescription>
            </EmptyHeader>
        </Empty>
    );
}

export default withControl(Controls);
