import { __ } from "@wordpress/i18n";
import withControl from "../../components/Controls/withControl";
import { ControlGeneratorProps } from "../../types";
import TitleControl from "../../components/Controls/Title";
import HeadingTagControl from "../../components/Controls/HeadingTag";
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
                        attrKey="value"
                        control={{ label: __("Title", "optiontics") }}
                        attributes={attributes}
                        setAttribute={setAttribute}
                    />
                    <HeadingTagControl
                        attrKey="tag"
                        control={{ label: __("Heading Tag", "optiontics") }}
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
