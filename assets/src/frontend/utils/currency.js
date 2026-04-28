/**
 * Currency formatting utilities.
 * Updated to read the new data-* attribute names emitted by Product_Form_View:
 *   data-currency, data-decimal, data-thousands, data-decimals, data-format
 */

import { DEFAULT_VALUES } from '../constants.js';

/**
 * Retrieve WooCommerce currency settings.
 * Priority: PHP data attributes on .opt-addon-form > WC global params > defaults.
 *
 * @param {HTMLElement} formElement - The .opt-addon-form wrapper element.
 * @returns {Object} Currency settings object.
 */
export const getCurrencySettings = (formElement) => {
  // Priority 1: data-* attributes injected by Product_Form_View::currency_attrs()
  if (formElement?.dataset.currency) {
    return {
      currencySymbol:    formElement.dataset.currency   || DEFAULT_VALUES.CURRENCY_SYMBOL,
      decimalSeparator:  formElement.dataset.decimal    || DEFAULT_VALUES.DECIMAL_SEPARATOR,
      thousandSeparator: formElement.dataset.thousands  || DEFAULT_VALUES.THOUSAND_SEPARATOR,
      numDecimals:       parseInt(formElement.dataset.decimals || DEFAULT_VALUES.DECIMALS, 10),
      symbolPosition:    formElement.dataset.format     || DEFAULT_VALUES.SYMBOL_POSITION,
    };
  }

  // Priority 2: WooCommerce global JS params
  if (typeof wc_add_to_cart_params !== 'undefined') {
    return {
      currencySymbol:    wc_add_to_cart_params.currency_symbol              || DEFAULT_VALUES.CURRENCY_SYMBOL,
      decimalSeparator:  wc_add_to_cart_params.currency_format_decimal_sep  || DEFAULT_VALUES.DECIMAL_SEPARATOR,
      thousandSeparator: wc_add_to_cart_params.currency_format_thousand_sep || DEFAULT_VALUES.THOUSAND_SEPARATOR,
      numDecimals:       parseInt(wc_add_to_cart_params.currency_format_num_decimals || DEFAULT_VALUES.DECIMALS, 10),
      symbolPosition:    wc_add_to_cart_params.currency_format              || DEFAULT_VALUES.SYMBOL_POSITION,
    };
  }

  // Priority 3: hard defaults
  return {
    currencySymbol:    DEFAULT_VALUES.CURRENCY_SYMBOL,
    decimalSeparator:  DEFAULT_VALUES.DECIMAL_SEPARATOR,
    thousandSeparator: DEFAULT_VALUES.THOUSAND_SEPARATOR,
    numDecimals:       DEFAULT_VALUES.DECIMALS,
    symbolPosition:    DEFAULT_VALUES.SYMBOL_POSITION,
  };
};

/**
 * Format a numeric price according to WooCommerce currency settings.
 *
 * @param {number|string} price            - Price value to format.
 * @param {Object}        currencySettings - Settings from getCurrencySettings().
 * @returns {string} Formatted price string.
 */
export const formatPrice = (price, currencySettings) => {
  const num       = parseFloat(price) || 0;
  const formatted = num.toFixed(currencySettings.numDecimals);

  // Apply thousand separators
  const parts = formatted.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, currencySettings.thousandSeparator);
  const formattedNumber = parts.join(currencySettings.decimalSeparator);

  const sym = currencySettings.currencySymbol;
  const pos = currencySettings.symbolPosition;

  if (pos.includes('%1$s %2$s')) return `${sym} ${formattedNumber}`;
  if (pos.includes('%2$s %1$s')) return `${formattedNumber} ${sym}`;
  if (pos.includes('%2$s%1$s'))  return `${formattedNumber}${sym}`;
  // Default: symbol before number (no space)
  return `${sym}${formattedNumber}`;
};
