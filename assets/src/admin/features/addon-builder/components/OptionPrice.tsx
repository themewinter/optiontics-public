import { Price } from "@/common/components/price";
import { getPrice } from "../utils";

/**
 * OptionPrice Component
 * 
 * Shared component for displaying option prices across all blocks.
 * Handles free options, regular prices, and sale prices with proper formatting.
 * 
 * @param {Object} props - Component props
 * @param {Object} props.option - The option object containing price information
 * @param {Function} props.calculatePercentage - Function to calculate percentage-based prices
 */
export const OptionPrice = ({ option, calculatePercentage }: any) => {
    const isFree = option.type === "no_cost" || option.regular === "Free";
    const hasSale = !isFree && Number(option.sale) > 0 && Number(option.regular) > 0;

    if (isFree) return null;

    const regular = getPrice(option.type, option.regular, calculatePercentage);
    const sale = getPrice(option.type, option.sale, calculatePercentage);

    if (hasSale) {
        return (
            <>
                {regular > 0 && <Price className="line-through mr-1" price={regular} />}
                {sale > 0 && <Price price={sale} />}
            </>
        );
    }

    if (regular > 0) return <Price price={regular} />;

    return null;
};

