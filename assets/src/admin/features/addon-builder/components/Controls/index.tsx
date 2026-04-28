import { ControlGeneratorProps } from "../../types";
import HeadingTagControl from "./HeadingTag";
import PanelControl from "./Panel";
import PlaceholderControl from "./Placeholder";
import TextControl from "./Text";
import TitleControl from "./Title";
import DescriptionControl from "./Description";
import RequiredControl from "./Required";
import QuantitySwitchControl from "./QuantitySwitch";
import QuantityFieldsControl from "./QuantityFields";
import SwitchFieldControl from "./switch-field";
import PricePositionControl from "./PricePosition";
import PriceTypeControl from "./price-type";
import SelectionModeControl from "./SelectionMode";

const controlsList = {
    panel: PanelControl,
    text: TextControl,
    title: TitleControl,
    placeholder: PlaceholderControl,
    heading_tag: HeadingTagControl,
    description: DescriptionControl,
    required_field: RequiredControl,
    quantity_switch: QuantitySwitchControl,
    quantity_fields: QuantityFieldsControl,
    switch_field: SwitchFieldControl,
    price_position: PricePositionControl,
    price_type: PriceTypeControl,
    selection_mode: SelectionModeControl,
};

export default function ControlGenerator<T extends Record<string, any>>({
    controls,
    attributes,
    setAttribute,
}: { controls: Record<string, any> } & ControlGeneratorProps<T>):
    | React.ReactNode
    | null
    | false {
    return Object.keys(controls).map((key) => {
        const control = controls[key as keyof Record<string, any>];

        const ControlView =
            controlsList[control.type as keyof typeof controlsList];

        if (!ControlView) {
            console.error(`Control of type "${control.type}" not found.`);
            return null;
        }

        if (
            Object.prototype.hasOwnProperty.call(control, "condition") &&
            !control.condition(attributes)
        ) {
            return false;
        }

        return (
            <ControlView
                key={key}
                attrKey={key}
                control={control}
                attributes={attributes}
                setAttribute={setAttribute}
            />
        );
    });
}
