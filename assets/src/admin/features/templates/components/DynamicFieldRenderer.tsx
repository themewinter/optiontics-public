/**
 * Internal dependencies
 */
import { ColorNameSelector } from "./OptionSelector";
import { RadioGroup, RadioGroupItem } from "@/shadcn/components/ui/radio-group";
import { Label } from "@/shadcn/components/ui";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shadcn/components/ui/select";

interface DynamicFieldRendererProps {
    field: {
        type: string;
        label?: string;
        placeholder?: string;
        _options?: Array<{ value: string; default?: boolean }>;
    };
    value: string;
    onChange: (value: string) => void;
}

const inputBase =
    "w-full p-2 text-sm border border-gray-300 rounded bg-white outline-none " +
    "focus:border-[var(--opt-primary)] focus:ring-1 focus:ring-[var(--opt-primary)]/20 transition-colors";

export function DynamicFieldRenderer({
    field,
    value,
    onChange,
}: DynamicFieldRendererProps) {
    const optionValues: string[] = (field._options ?? [])
        .map((o) => o.value)
        .filter(Boolean);

    switch (field.type) {
        case "textfield":
            return (
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={field.placeholder ?? ""}
                    className={inputBase}
                />
            );

        case "textarea":
            return (
                <textarea
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={field.placeholder ?? ""}
                    rows={3}
                    className="w-full p-2 text-sm border border-gray-300 rounded bg-white resize-none outline-none focus:border-[var(--opt-primary)] focus:ring-1 focus:ring-[var(--opt-primary)]/20 transition-colors"
                />
            );

        case "number":
            return (
                <input
                    type="number"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={field.placeholder ?? ""}
                    className="w-full p-2 text-sm border border-gray-300 rounded bg-white outline-none focus:border-[var(--opt-primary)] focus:ring-1 focus:ring-[var(--opt-primary)]/20 transition-colors"
                />
            );

        case "radio":
            return (
                <div className="border border-gray-200 rounded-md py-2">
                    <RadioGroup value={value} onValueChange={onChange} className="gap-0">
                        {optionValues.map((opt, i) => (
                            <div key={opt} className="flex items-center gap-2 px-3 py-1">
                                <RadioGroupItem value={opt} id={`dfr-radio-${i}`} />
                                <Label
                                    htmlFor={`dfr-radio-${i}`}
                                    className="font-normal text-sm text-gray-800 cursor-pointer"
                                >
                                    {opt}
                                </Label>
                            </div>
                        ))}
                    </RadioGroup>
                </div>
            );

        case "select":
            return (
                <Select value={value} onValueChange={onChange}>
                    <SelectTrigger className="w-full h-9! rounded! border border-gray-300! text-sm">
                        <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                        {optionValues.map((opt) => (
                            <SelectItem key={opt} value={opt} className="text-sm">
                                {opt}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            );

        case "color-swatch":
            return (
                <ColorNameSelector
                    options={optionValues}
                    selected={value}
                    onSelect={onChange}
                />
            );

        case "checkbox":
            return (
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={value === "true"}
                        onChange={(e) => onChange(e.target.checked ? "true" : "false")}
                        className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-[var(--opt-primary)]"
                    />
                    <span className="text-sm text-gray-600">
                        {field.label}
                    </span>
                </label>
            );

        case "button":
            return (
                <div className="flex flex-wrap gap-1.5">
                    {optionValues.map((opt) => (
                        <button
                            key={opt}
                            type="button"
                            onClick={() => onChange(opt)}
                            className={
                                "px-4 py-2 text-sm font-medium rounded border transition-all duration-150 " +
                                (value === opt
                                    ? "bg-gray-900 text-white border-gray-900"
                                    : "bg-white text-gray-600 border-gray-300 hover:border-gray-500")
                            }
                        >
                            {opt}
                        </button>
                    ))}
                </div>
            );

        case "image-upload": {
            const mediaUrl = value;
            return (
                <div className="flex flex-col gap-2">
                    {mediaUrl ? (
                        <div className="relative w-full h-32 bg-gray-100 rounded-lg overflow-hidden">
                            <img
                                src={mediaUrl}
                                alt={field.label}
                                className="w-full h-full object-cover"
                            />
                            <button
                                type="button"
                                onClick={() => onChange("")}
                                className="absolute top-2 right-2 w-6 h-6 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white text-xs"
                            >
                                ✕
                            </button>
                        </div>
                    ) : (
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-200 rounded-lg cursor-pointer hover:border-gray-300 transition-colors">
                            <span className="text-xs text-gray-400">Click to upload</span>
                            <input
                                type="text"
                                value={value}
                                onChange={(e) => onChange(e.target.value)}
                                placeholder="Enter image URL"
                                className="hidden"
                            />
                        </label>
                    )}
                </div>
            );
        }

        case "date": {
            return (
                <input
                    type="date"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className={inputBase}
                />
            );
        }

        case "time": {
            return (
                <input
                    type="time"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className={inputBase}
                />
            );
        }

        case "datetime-local": {
            return (
                <input
                    type="datetime-local"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className={inputBase}
                />
            );
        }

        case "range": {
            const opts = field._options ?? [];
            const min = opts.find((o) => o.value.startsWith("min:"))?.value.replace("min:", "") ?? "0";
            const max = opts.find((o) => o.value.startsWith("max:"))?.value.replace("max:", "") ?? "100";
            const step = opts.find((o) => o.value.startsWith("step:"))?.value.replace("step:", "") ?? "1";
            return (
                <div className="flex flex-col gap-1">
                    <input
                        type="range"
                        min={min}
                        max={max}
                        step={step}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-xs text-gray-500 text-center">{value}</span>
                </div>
            );
        }

        case "email": {
            return (
                <input
                    type="email"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={field.placeholder ?? ""}
                    className={inputBase}
                />
            );
        }

        case "url": {
            return (
                <input
                    type="url"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={field.placeholder ?? ""}
                    className={inputBase}
                />
            );
        }

        case "tel": {
            return (
                <input
                    type="tel"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={field.placeholder ?? ""}
                    className={inputBase}
                />
            );
        }

        case "search": {
            return (
                <input
                    type="search"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={field.placeholder ?? ""}
                    className={inputBase}
                />
            );
        }

        case "password": {
            return (
                <input
                    type="password"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={field.placeholder ?? ""}
                    className={inputBase}
                />
            );
        }

        case "file": {
            return (
                <label className="flex items-center justify-center w-full p-2 text-sm border border-gray-300 rounded bg-white cursor-pointer hover:bg-gray-50 transition-colors">
                    <span className="text-gray-500 truncate">{value || "Choose file..."}</span>
                    <input
                        type="file"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className="hidden"
                    />
                </label>
            );
        }

        case "color": {
            return (
                <div className="flex items-center gap-2">
                    <input
                        type="color"
                        value={value || "#000000"}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-9 h-9 p-0 border-0 rounded cursor-pointer"
                    />
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder="#000000"
                        className={inputBase}
                    />
                </div>
            );
        }

        default:
            return (
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={field.placeholder ?? ""}
                    className={inputBase}
                />
            );
    }
}