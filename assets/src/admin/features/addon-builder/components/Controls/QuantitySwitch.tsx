/**
 * Internal dependencies
 */
import { OptionSwitch } from "./options-switch";
import { Control, ControlGeneratorProps } from "../../types";
import { useAdminLicenseCheck } from "@/common/hooks/useAdminLicenseCheck";
import { ProBadge } from "@/common/components";

export default function QuantitySwitchControl({
    attrKey,
    control,
    attributes,
    setAttribute,
}: ControlGeneratorProps<any> & { control: Control }): React.ReactElement {
    const enabled = useAdminLicenseCheck();

    return (
        <OptionSwitch
            label={
                <>
                    {control.label as string}
                    {!enabled && <ProBadge />}
                </>
            }
            description={control.description as string | undefined}
            checked={
                enabled &&
                Boolean(attributes[attrKey as keyof typeof attributes])
            }
            onChange={(checked) =>
                setAttribute(attrKey as string, Boolean(checked))
            }
            disabled={!enabled}
        />
    );
}
