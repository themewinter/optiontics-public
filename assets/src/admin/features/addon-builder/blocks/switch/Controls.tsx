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
import TitleControl from "../../components/Controls/Title";
import DescriptionControl from "../../components/Controls/Description";
import QuantityFieldsControl from "../../components/Controls/QuantityFields";
import QuantitySwitchControl from "../../components/Controls/QuantitySwitch";
import { If } from "@/common/components/If";
import CheckBydefaultControl from "../../components/Controls/switch-field/CheckBydefault";
import SwitchLabelControl from "../../components/Controls/switch-field/SwitchLabel";
import BuilderTabs from "../../components/BuilderTabs";
import { TabsContent } from "@/shadcn/components/ui";
import ConditionalLogicControl from "../../components/Controls/conditional-logic";
import { ComingSoon } from "../../components/CommingSoon";

function Controls({ attributes, setAttribute }: ControlGeneratorProps<any>) {
    return (
        <BuilderTabs>
            <TabsContent value="general">
                <div className="flex flex-col gap-4">
  
                    <TitleControl
                        attrKey="label"
                        control={{ label: __("Title", "optiontics"), type: "title" }}
                        attributes={attributes}
                        setAttribute={setAttribute}
                    />
                    <DescriptionControl
                        attrKey="desc"
                        control={{ label: __("Description", "optiontics"), type: "description" }}
                        attributes={attributes}
                        setAttribute={setAttribute}
                    />
                    <SwitchLabelControl
                        attributes={attributes}
                        setAttribute={setAttribute}
                    />
                     <div className="flex gap-2 flex-col justify-between whitespace-nowrap">
                        <RequiredControl
                            attrKey="required"
                            control={{ label: __("Required", "optiontics"), type: "required_field" }}
                            attributes={attributes}
                            setAttribute={setAttribute}
                        />
                        <CheckBydefaultControl
                            attrKey="options"
                            control={{ label: __("Checked by default", "optiontics") }}
                            attributes={attributes}
                            setAttribute={setAttribute}
                        />
                         <QuantitySwitchControl
                            attrKey="isQuantity"
                            control={{ label: __("Enable Quantity", "optiontics"), type: "quantity_field", description: __("Add Minimum & Minimum quantity for this option", "optiontics") }}
                            attributes={attributes}
                            setAttribute={setAttribute}
                        />
                    </div>
                    <If condition={attributes?.isQuantity}>
                        <QuantityFieldsControl
                            attributes={attributes}
                            setAttribute={setAttribute}
                        />
                    </If>
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
