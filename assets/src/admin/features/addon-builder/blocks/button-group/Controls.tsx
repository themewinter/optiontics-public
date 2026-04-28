/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";

/**
 * Internal dependencies
 */
import withControl from "../../components/Controls/withControl";
import { ControlGeneratorProps } from "../../types";
import BuilderTabs from "../../components/BuilderTabs";
import { TabsContent } from "@/shadcn/components/ui";
import RequiredControl from "../../components/Controls/Required";
import TitleControl from "../../components/Controls/Title";
import DescriptionControl from "../../components/Controls/Description";
import SelectionModeControl from "../../components/Controls/SelectionMode";
import OptionsControlCompact from "../../components/Controls/options/OptionsControlCompact";
import ConditionalLogicControl from "../../components/Controls/conditional-logic";
import { ComingSoon } from "../../components/CommingSoon";

/**
 * Button Group controls.
 *
 * Layout: Title → Description → Option values trigger → Selection mode →
 * Required. Selection mode and Required sit under the Option values trigger
 * so the picker sits closest to the items it affects.
 */
function ButtonGroupControls({
    attributes,
    setAttribute,
}: ControlGeneratorProps<any>) {
    return (
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
                    <SelectionModeControl
                        attrKey="selection"
                        control={{
                            label: __("Selection mode", "optiontics"),
                            type: "selection_mode",
                        }}
                        attributes={attributes}
                        setAttribute={setAttribute}
                    />
                    <RequiredControl
                        attrKey="required"
                        control={{
                            label: __("Required", "optiontics"),
                            type: "required_field",
                        }}
                        attributes={attributes}
                        setAttribute={setAttribute}
                    />
                </div>
            </TabsContent>
            <TabsContent value="conditions">
                <ConditionalLogicControl
                    attributes={attributes}
                    setAttribute={setAttribute}
                />
            </TabsContent>
            <TabsContent value="styles">
                <ComingSoon />
            </TabsContent>
        </BuilderTabs>
    );
}

export default withControl(ButtonGroupControls);
