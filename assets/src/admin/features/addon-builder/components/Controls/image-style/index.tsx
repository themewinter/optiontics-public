/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";

/**
 * Internal dependencies
 */
import {
    InputGroup,
    InputGroupInput,
    InputGroupAddon,
} from "@/shadcn/components/ui/input-group";
import { ControlGeneratorProps } from "../../../types";
import {
    Accordion,
    AccordionTrigger,
    AccordionContent,
    AccordionItem,
} from "@/shadcn/components/ui/accordion";

export default function ImageStyleControl({
    attributes,
    setAttribute,
}: ControlGeneratorProps<any>): React.ReactElement {
    const styles = attributes._styles || {
        height: { val: 32 },
        width: { val: 32 },
        radius: { val: 4 },
        mrR: { val: 8 },
    };

    const handleStyleChange = (key: string, value: number) => {
        const updatedStyles = {
            ...styles,
            [key]: {
                ...styles[key],
                val: value,
            },
        };
        setAttribute("_styles", updatedStyles);
    };

    return (
        <Accordion type="single" collapsible defaultValue="image-styles">
            <AccordionItem value="image-styles">
                <AccordionTrigger className="text-base font-medium text-gray-700 w-full cursor-pointer pb-0!">
                    {__("Image Styles", "optiontics")}
                </AccordionTrigger>
                <AccordionContent>
                    <div className="flex flex-col gap-2">
                        {/* First row: Height, Width, Border Radius */}
                        <div className="flex gap-2 w-full">
                            <div className="flex flex-col gap-2 w-full">
                                <p className="text-sm font-medium text-gray-700 my-1!">
                                    {__("Height", "optiontics")}
                                </p>
                                <InputGroup className="has-[[data-slot=input-group-control]:focus-visible]:border-input has-[[data-slot=input-group-control]:focus-visible]:ring-0 rounded! border border-gray-300!">
                                    <InputGroupInput
                                        id="height"
                                        type="number"
                                        value={styles.height?.val || 32}
                                        onChange={(e) =>
                                            handleStyleChange(
                                                "height",
                                                Number(e.target.value) || 0,
                                            )
                                        }
                                        className="border-none! bg-transparent!"
                                    />
                                    <InputGroupAddon align="inline-end">
                                        <span>px</span>
                                    </InputGroupAddon>
                                </InputGroup>
                            </div>
                            <div className="flex flex-col gap-2 w-full">
                                <p className="text-sm font-medium text-gray-700 my-1!">
                                    {__("Width", "optiontics")}
                                </p>
                                <InputGroup className="has-[[data-slot=input-group-control]:focus-visible]:border-input has-[[data-slot=input-group-control]:focus-visible]:ring-0 rounded! border border-gray-300!">
                                    <InputGroupInput
                                        id="width"
                                        type="number"
                                        value={styles.width?.val || 32}
                                        onChange={(e) =>
                                            handleStyleChange(
                                                "width",
                                                Number(e.target.value) || 0,
                                            )
                                        }
                                        className="border-none! bg-transparent!"
                                    />
                                    <InputGroupAddon align="inline-end">
                                        <span>px</span>
                                    </InputGroupAddon>
                                </InputGroup>
                            </div>
                        </div>
                        {/* Second row: Gap (below Height) */}
                        <div className="flex gap-2 w-full">
                            <div className="flex flex-col gap-2 w-full">
                                <p className="text-sm font-medium text-gray-700 my-1!">
                                    {__("Border Radius", "optiontics")}
                                </p>
                                <InputGroup className="has-[[data-slot=input-group-control]:focus-visible]:border-input has-[[data-slot=input-group-control]:focus-visible]:ring-0 rounded! border border-gray-300!">
                                    <InputGroupInput
                                        id="radius"
                                        type="number"
                                        value={styles.radius?.val || 4}
                                        onChange={(e) =>
                                            handleStyleChange(
                                                "radius",
                                                Number(e.target.value) || 0,
                                            )
                                        }
                                        className="border-none! bg-transparent!"
                                    />
                                    <InputGroupAddon align="inline-end">
                                        <span>px</span>
                                    </InputGroupAddon>
                                </InputGroup>
                            </div>
                            <div className="flex flex-col gap-2 w-full">
                                <p className="text-sm font-medium text-gray-700 my-1!">
                                    {__("Gap", "optiontics")}
                                </p>
                                <InputGroup className="has-[[data-slot=input-group-control]:focus-visible]:border-input has-[[data-slot=input-group-control]:focus-visible]:ring-0 rounded! border border-gray-300!">
                                    <InputGroupInput
                                        id="gap"
                                        type="number"
                                        value={styles.mrR?.val || 8}
                                        onChange={(e) =>
                                            handleStyleChange(
                                                "mrR",
                                                Number(e.target.value) || 0,
                                            )
                                        }
                                        className="border-none! bg-transparent!"
                                    />
                                    <InputGroupAddon align="inline-end">
                                        <span>px</span>
                                    </InputGroupAddon>
                                </InputGroup>
                            </div>
                        </div>
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
}
