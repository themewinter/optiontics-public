/**
 * External dependencies
 */
import { __ } from "@wordpress/i18n";

/**
 * Internal dependencies
 */
import withControl from "../../components/Controls/withControl";
import { ControlGeneratorProps } from "../../types";
import RequiredControl from "../../components/Controls/Required";
import DescriptionControl from "../../components/Controls/Description";
import TitleControl from "../../components/Controls/Title";
import PlaceholderControl from "../../components/Controls/Placeholder";
import PricePositionControl from "../../components/Controls/PricePosition";
import PriceTypeControl from "../../components/Controls/price-type";
import BuilderTabs from "../../components/BuilderTabs";
import { TabsContent } from "@/shadcn/components/ui";
import ConditionalLogicControl from "../../components/Controls/conditional-logic";
import { ComingSoon } from "../../components/CommingSoon";

function Controls({ attributes, setAttribute }: ControlGeneratorProps<any>) {
    return (
        <BuilderTabs>
            <TabsContent value="general">
                <div className="flex flex-col gap-4">
                    <div className="flex gap-2 w-full">
                        <TitleControl
                            attrKey="label"
                            control={{ label: __("Title", "optiontics") }}
                            attributes={attributes}
                            setAttribute={setAttribute}
                        />
                        <PricePositionControl
                            attrKey="pricePosition"
                            control={{ label: __("Price Position", "optiontics") }}
                            attributes={attributes}
                            setAttribute={setAttribute}
                        />
                    </div>
                    <DescriptionControl
                        attrKey="desc"
                        control={{ label: __("Description", "optiontics") }}
                        attributes={attributes}
                        setAttribute={setAttribute}
                    />
                    <PlaceholderControl
                        attrKey="placeholder"
                        control={{ label: __("Placeholder", "optiontics") }}
                        attributes={attributes}
                        setAttribute={setAttribute}
                    />
                    <PriceTypeControl
                        attributes={attributes}
                        setAttribute={setAttribute}
                    />
                    <RequiredControl
                        attrKey="businessOnly"
                        control={{ label: __("Business Email Only", "optiontics") }}
                        attributes={attributes}
                        setAttribute={setAttribute}
                    />
                    <RequiredControl
                        attrKey="required"
                        control={{ label: __("Required", "optiontics") }}
                        attributes={attributes}
                        setAttribute={setAttribute}
                    />
                </div>
            </TabsContent>
            <TabsContent value="styles">
                <ComingSoon />
            </TabsContent>
            <TabsContent value="conditions">
                <ConditionalLogicControl
                    attributes={attributes}
                    setAttribute={setAttribute}
                />
            </TabsContent>
        </BuilderTabs>
    );
}

export default withControl(Controls);
