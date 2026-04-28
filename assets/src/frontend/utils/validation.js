/**
 * Validation utilities for quantity and form fields.
 * Updated to read data-node attribute from Dom_Utilities::quantity_input().
 */

import { DEFAULT_VALUES } from '../constants.js';

/**
 * Clamp a quantity input's value between its min and max bounds.
 * Reads the plain min/max attributes (not data-min/data-max) because
 * Dom_Utilities::quantity_input() sets native HTML min/max attributes.
 *
 * @param {HTMLInputElement} qtyInput - Quantity input element.
 * @returns {number} Clamped value.
 */
export const validateQuantity = (qtyInput) => {
  if (!qtyInput) return DEFAULT_VALUES.MIN_QUANTITY;

  const minQty = parseInt(qtyInput.min || DEFAULT_VALUES.MIN_QUANTITY, 10);
  const maxQty = parseInt(qtyInput.max || DEFAULT_VALUES.MAX_QUANTITY, 10);
  let value    = parseInt(qtyInput.value, 10) || minQty;

  if (value < minQty) {
    value = minQty;
    qtyInput.value = minQty;
  } else if (value > maxQty) {
    value = maxQty;
    qtyInput.value = maxQty;
  }

  return value;
};

/**
 * Get a validated quantity from an input, or 1 when no input is present.
 *
 * @param {HTMLInputElement|null} qtyInput
 * @returns {number}
 */
export const getValidatedQuantity = (qtyInput) =>
  qtyInput ? validateQuantity(qtyInput) : DEFAULT_VALUES.MIN_QUANTITY;
