import { Switch } from "@/shadcn/components/ui";
import { cn } from "@/shadcn/lib/utils";
import { If } from "../If";

type Props = {
    name: string;
    checked: boolean;
    onChange?: (checked: boolean) => void;
    label?: string;
    className?: string;
    image?: string;
    imageStyle?: React.CSSProperties;
};

export const CustomSwitch = ({
    name,
    checked,
    onChange,
    label,
    className,
    image,
    imageStyle,
    ...props
}: Props) => {
    return (
        <div className={cn("flex items-center gap-2", className)}>
            <Switch
                id={name}
                checked={checked}
                onCheckedChange={onChange}
                {...props}
            />
            <label htmlFor={name} className="text-sm flex items-center gap-2">
                <If condition={image}>
                    <img
                        src={image}
                        alt={label}
                        style={imageStyle || {}}
                        className="rounded-md size-10"
                    />
                </If>
                {label}
            </label>
        </div>
    );
};
