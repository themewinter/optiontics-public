/**
 * Wordpress Dependencies
 */
import { __ } from "@wordpress/i18n";

/**
 * Internal dependencies
 */
import withControl from "../withControl";
import { ControlGeneratorProps } from "../../../types";
import QuantitySwitchControl from "../QuantitySwitch";
import RequiredControl from "../Required";
import { If } from "@/common/components";
import OptionsControlCompact from "./OptionsControlCompact";
import TitleControl from "../Title";
import DescriptionControl from "../Description";
import BuilderTabs from "../../BuilderTabs";
import { TabsContent } from "@/shadcn/components/ui";
import QuantityFieldsControl from "../QuantityFields";
import ConditionalLogicControl from "../conditional-logic";
// // import ImageStyleControl from "../image-style";
import VerticalControl from "../Vertical";
import { ComingSoon } from "../../CommingSoon";

/**
 * Standard options controls layout shared by option-based blocks (Radio, Dropdown, etc.)
 * Provides: Required, Quantity Switch (conditional), Title, Description, Quantity Fields (conditional), Options Control
 *
 * This component encapsulates the common control structure to follow DRY principles.
 * Quantity controls are shown for blocks that support them (e.g., Radio) but hidden for others (e.g., Dropdown).
 */
function StandardOptionsControls({
    attributes,
    setAttribute,
}: ControlGeneratorProps<any>) {
    // Determine if quantity controls should be shown based on block type
    // Radio, Checkbox, and Button support quantity, Dropdown (select) does not
    const showQuantity =
        attributes.type === "radio" ||
        attributes.type === "checkbox" ||
        attributes.type === "button";

    return (
        <>
            <BuilderTabs>
                <TabsContent value="general">
                    <div className="flex flex-col gap-4">
                        <TitleControl
                            attrKey="label"
                            control={{
                                label: __("Title", "optiontics"),
                                type: "title",
                            }}
                            attributes={attributes}
                            setAttribute={setAttribute}
                        />
                        <DescriptionControl
                            attrKey="desc"
                            control={{
                                label: __("Description", "optiontics"),
                                type: "description",
                            }}
                            attributes={attributes}
                            setAttribute={setAttribute}
                        />

                        <OptionsControlCompact
                            attributes={attributes}
                            setAttribute={setAttribute}
                        />
                        <div className="flex flex-col gap-2">
                            <RequiredControl
                                attrKey="required"
                                control={{
                                    label: __("Required", "optiontics"),
                                    type: "required_field",
                                }}
                                attributes={attributes}
                                setAttribute={setAttribute}
                            />
                            <If condition={attributes.type === "button"}>
                                <VerticalControl
                                    attrKey="vertical"
                                    control={{
                                        label: __("Vertical", "optiontics"),
                                        type: "vertical",
                                    }}
                                    attributes={attributes}
                                    setAttribute={setAttribute}
                                />
                            </If>
                            <If
                                condition={
                                    showQuantity && attributes.type !== "button"
                                }
                            >
                                <QuantitySwitchControl
                                    attrKey="isQuantity"
                                    control={{
                                        label: __("Enable Quantity", "optiontics"),
                                        type: "quantity_field",
                                        description: __("Add Minimum & Maximum quantity for this option", "optiontics"),
                                    }}
                                    attributes={attributes}
                                    setAttribute={setAttribute}
                                />
                            </If>
                            <If
                                condition={showQuantity && attributes.type !== "button"}
                            >
                                <If condition={attributes.isQuantity}>
                                    <QuantityFieldsControl
                                        attributes={attributes}
                                        setAttribute={setAttribute}
                                    />
                                </If>
                            </If>
                        </div>
                    </div>
                </TabsContent>
                <TabsContent value="conditions">
                    <ConditionalLogicControl
                        attributes={attributes}
                        setAttribute={setAttribute}
                    /> 
                </TabsContent>
                <TabsContent value="styles">
                    {/* <If condition={attributes.type !== "button"}>
                        <ImageStyleControl
                            attributes={attributes}
                            setAttribute={setAttribute}
                        />
                    </If> */}
                    <ComingSoon />
                </TabsContent>
            </BuilderTabs>
        </>
    );
}

export default withControl(StandardOptionsControls);