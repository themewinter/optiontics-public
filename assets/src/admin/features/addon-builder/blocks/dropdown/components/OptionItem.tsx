import {
    SelectItem,
} from "@/shadcn/components/ui/select";
import { OptionPrice } from "../../../components/OptionPrice";
import { If } from "@/common/components/If";

export const OptionItem = ({
    option,
    styles,
    calculatePercentage
}: any) => {
    if (!option.value) return null;

    return (
        <SelectItem value={option.value}>
            <div className="flex items-center gap-2 w-full">
                <If condition={option.image}>
                    <img
                        src={option.image}
                        alt={option.value}
                        style={{
                            width: `${styles.width.val}px`,
                            height: `${styles.height.val}px`,
                            borderRadius: `${styles.radius.val}px`,
                            marginRight: `${styles.mrR.val}px`,
                        }}
                        className="rounded-md size-10"
                    />
                </If>
                <span className="flex-1 text-gray-900!">{option.value}</span>
                <span className="text-sm text-gray-500">
                    <OptionPrice option={option} calculatePercentage={calculatePercentage} />
                </span>
            </div>
        </SelectItem>
    );
};

