import { ReactElement } from "@wordpress/element";

interface CurrencyData {
    symbol?: string;
    decimal_separator?: string;
    thousand_separator?: string;
    num_decimals?: number;
    symbol_position?: string;
}

declare global {
    interface Window {
        optiontics?: {
            currency?: CurrencyData;
        };
    }
}

export interface PriceProps {
    price?: number | string | null;
    className?: string;
}

/**
 * Parses PHP sprintf format symbol position to determine placement
 * Formats: %1$s = symbol, %2$s = price
 * Examples: "%1$s%2$s" = symbol before price, "%2$s%1$s" = price before symbol
 */
const parseSymbolPosition = (
    symbolPosition: string,
): { position: "left" | "right"; hasSpace: boolean } => {
    if (!symbolPosition) {
        return { position: "left", hasSpace: false };
    }

    // Check for space in format
    const hasSpace = symbolPosition.includes(" ");

    // Determine position based on order of placeholders
    if (
        symbolPosition.includes("%1$s%2$s") ||
        symbolPosition.includes("%1$s %2$s")
    ) {
        return { position: "left", hasSpace };
    } else if (
        symbolPosition.includes("%2$s%1$s") ||
        symbolPosition.includes("%2$s %1$s")
    ) {
        return { position: "right", hasSpace };
    }

    // Default to left
    return { position: "left", hasSpace: false };
};

export const getCurrencySymbolHtml = (): ReactElement | null => {
    const { symbol } = window?.optiontics?.currency || {};
    if (!symbol) return null;
    return <span dangerouslySetInnerHTML={{ __html: symbol }} />;
};

/**
 * Formats a number with thousand and decimal separators
 */
const formatNumber = (
    price: number | string,
    decimalSeparator: string,
    thousandSeparator: string,
    numDecimals: number,
): string => {
    const numPrice = Number(price) || 0;
    const formatted = numPrice.toFixed(numDecimals);

    // Split into integer and decimal parts
    const parts = formatted.split(".");

    // Add thousand separators to integer part
    if (parts[0]) {
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator);
    }

    // Join with decimal separator
    return parts.join(decimalSeparator);
};

export const Price = ({ price = 0, className }: PriceProps) => {
    if (price == null || price === "") return null;

    // Get currency settings from window object or use defaults
    const currencyData: CurrencyData = window?.optiontics?.currency || {};
    const {
        symbol = "$",
        decimal_separator = ".",
        thousand_separator = ",",
        num_decimals = 2,
        symbol_position = "%1$s%2$s",
    } = currencyData;

    // Format the number with separators
    const formattedNumber = formatNumber(
        price,
        decimal_separator,
        thousand_separator,
        num_decimals,
    );

    // Parse symbol position
    const { position, hasSpace } = parseSymbolPosition(symbol_position);

    // Wrap the symbol inside a span (symbol may contain HTML entities)
    const symbolHtml = `<span class="optiontics-price-symbol">${symbol}</span>`;

    // Build final price HTML based on position
    let finalPriceHtml = "";
    const space = hasSpace ? " " : "";

    if (position === "left") {
        finalPriceHtml = `${symbolHtml}${space}${formattedNumber}`;
    } else {
        finalPriceHtml = `${formattedNumber}${space}${symbolHtml}`;
    }

    return (
        <span
            className={className}
            aria-label={`Price: ${formattedNumber}`}
            dangerouslySetInnerHTML={{ __html: finalPriceHtml }}
        />
    );
};
