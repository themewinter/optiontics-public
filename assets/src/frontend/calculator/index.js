/**
 * Price calculation and display utilities
 */

import { formatPrice } from '../utils/currency.js';
import {
  processRadioInputs,
  processCheckboxInputs,
  processSelectInputs,
  processSimpleInputs,
  processSwitchInputs,
} from '../processors/index.js';
import { parseFloatSafe } from '../utils/helpers.js';

/**
 * Collects all selected addons from the form
 * @param {HTMLElement} formElement - The addon form element
 * @returns {Array} Array of all selected addon objects
 */
export const collectSelectedAddons = (formElement) => {
  return [
    ...processRadioInputs(formElement),
    ...processCheckboxInputs(formElement),
    ...processSelectInputs(formElement),
    ...processSimpleInputs(formElement),
    ...processSwitchInputs(formElement),
  ];
};

/**
 * Calculates total price from selected addons
 * @param {Array} addons - Array of addon objects
 * @returns {number} Total price
 */
export const calculateTotalPrice = (addons) => {
  return addons.reduce((total, addon) => {
    return total + parseFloatSafe(addon.price) * (addon.qty || 1);
  }, 0);
};

/**
 * Updates price displays and stores addon data
 * @param {HTMLElement} formElement - The addon form element
 * @param {HTMLElement} totalDisplay - Element displaying total price
 * @param {HTMLElement} addonTotalPrice - Element displaying addon-only price
 * @param {HTMLElement} hiddenInput - Hidden input for storing JSON data
 * @param {number} productPrice - Base product price
 * @param {Object} currencySettings - Currency configuration
 */
export const updatePriceDisplays = (
  formElement,
  totalDisplay,
  addonTotalPrice,
  hiddenInput,
  productPrice,
  currencySettings,
  productQty = 1
) => {
  const selectedAddons = collectSelectedAddons(formElement);
  const addonTotal = calculateTotalPrice(selectedAddons);
  const qty = Math.max(1, parseFloatSafe(productQty) || 1);
  const grandTotal = (productPrice + addonTotal) * qty;

  // Update display elements
  if (totalDisplay) {
    totalDisplay.textContent = formatPrice(grandTotal, currencySettings);
  }
  if (addonTotalPrice) {
    addonTotalPrice.textContent = formatPrice(addonTotal, currencySettings);
  }

  // Store addon data as JSON
  if (hiddenInput) {
    hiddenInput.value = JSON.stringify(selectedAddons);
  }
};

