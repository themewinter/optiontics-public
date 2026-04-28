/**
 * Internal dependencies
 */
import { CustomSwitch } from "@/common/components/form";

export const ConditionalLogicToggle: React.FC<{
    enabled: boolean;
    onChange: (enabled: boolean) => void;
}> = ({ enabled, onChange }) => (
    <CustomSwitch
        name="en_logic"
        checked={enabled}
        onChange={onChange}
    />
);
