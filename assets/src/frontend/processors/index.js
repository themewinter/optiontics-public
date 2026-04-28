/**
 * Addon input processors — extract selection data from rendered field templates.
 * Updated to use new opt-* class selectors and data-* attribute names.
 */

import { SELECTORS, INPUT_CONFIGS } from '../constants.js';
import { getLabelFromGroup, getOptionLabelFromInput } from '../utils/dom.js';
import { getValidatedQuantity } from '../utils/validation.js';
import { parseFloatSafe } from '../utils/helpers.js';

// ============================================================================
// INTERNAL HELPERS
// ============================================================================

/**
 * Read the price from an input's data-price attribute.
 *
 * @param {HTMLElement} el
 * @returns {number}
 */
const readPrice = (el) => parseFloatSafe(el.dataset.price);

/**
 * Find the quantity input for a checkable input.
 *
 * Checkbox/radio: qty lives inside the nearest .opt-choice wrapper.
 * Toggle/switch:  qty lives inside .opt-toggle-row (no .opt-choice wrapper),
 *                 so fall back to the field group container.
 *
 * @param {HTMLElement} choiceInput - The checkbox/radio/toggle input.
 * @returns {HTMLInputElement|null}
 */
const findQtyInput = (choiceInput) =>
  choiceInput.closest(SELECTORS.CHOICE_ITEM)?.querySelector(SELECTORS.QUANTITY_INPUT) ||
  choiceInput.closest('.opt-toggle-row')?.querySelector(SELECTORS.QUANTITY_INPUT) ||
  choiceInput.closest('.opt-group--toggle')?.querySelector(SELECTORS.QUANTITY_INPUT) ||
  null;

/**
 * True when the input belongs to a field wrapper that conditional logic
 * has hidden — such inputs must not contribute to the cart submission.
 *
 * @param {HTMLElement} el
 * @returns {boolean}
 */
const isConditionallyHidden = (el) =>
  el.closest('[data-condition-hidden="1"]') !== null;

// ============================================================================
// SIMPLE TEXT-LIKE INPUTS (text, textarea, tel, number)
// ============================================================================

/**
 * Process a single text-like input selector.
 *
 * @param {HTMLElement} formElement
 * @param {string}      selector
 * @param {string}      type
 * @param {string}      defaultName
 * @returns {Array}
 */
export const processSimpleInput = (formElement, selector, type, defaultName = '') => {
  const results = [];

  formElement.querySelectorAll(selector).forEach((input) => {
    if (isConditionallyHidden(input)) return;
    const value = input.value.trim();
    if (!value) return;

    results.push({
      type,
      name:  input.name || defaultName,
      label: getLabelFromGroup(input, defaultName),
      value,
      price: readPrice(input),
      qty:   1,
    });
  });

  return results;
};

/**
 * Process all configured text-like inputs.
 *
 * @param {HTMLElement} formElement
 * @returns {Array}
 */
export const processSimpleInputs = (formElement) => {
  const results = [];
  INPUT_CONFIGS.forEach(({ selector, type, defaultName }) => {
    results.push(...processSimpleInput(formElement, selector, type, defaultName));
  });
  return results;
};

// ============================================================================
// CHECKABLE INPUTS (checkbox, radio, toggle)
// ============================================================================

/**
 * Build a selection object for a checked checkable input.
 *
 * @param {HTMLInputElement} el   - The checked input.
 * @param {string}           type - Field type slug.
 * @param {HTMLInputElement|null} qtyInput
 * @returns {Object}
 */
export const processCheckableInput = (el, type, qtyInput = null) => {
  const groupLabel   = getLabelFromGroup(el, el.name);
  const optionLabel  = getOptionLabelFromInput(el, groupLabel);

  return {
    type,
    name:        el.name,
    label:       groupLabel,
    optionLabel,
    value:       el.value || 'yes',
    price:       readPrice(el),
    qty:         getValidatedQuantity(qtyInput),
  };
};

// ============================================================================
// RADIO BUTTONS
// ============================================================================

/**
 * Collect all checked radio inputs across the form.
 *
 * @param {HTMLElement} formElement
 * @returns {Array}
 */
export const processRadioInputs = (formElement) => {
  const results = [];
  formElement.querySelectorAll(`${SELECTORS.RADIO}:checked`).forEach((radio) => {
    if (isConditionallyHidden(radio)) return;
    results.push(processCheckableInput(radio, 'radio', findQtyInput(radio)));
  });
  return results;
};

// ============================================================================
// CHECKBOXES
// ============================================================================

/**
 * Collect all checked checkbox inputs across the form.
 *
 * @param {HTMLElement} formElement
 * @returns {Array}
 */
export const processCheckboxInputs = (formElement) => {
  const results = [];
  formElement.querySelectorAll(`${SELECTORS.CHECKBOX}:checked`).forEach((cb) => {
    if (isConditionallyHidden(cb)) return;
    results.push(processCheckableInput(cb, 'checkbox', findQtyInput(cb)));
  });
  return results;
};

// ============================================================================
// SELECT DROPDOWNS
// ============================================================================

/**
 * Collect all selected dropdown options (index > 0 = real selection).
 *
 * @param {HTMLElement} formElement
 * @returns {Array}
 */
export const processSelectInputs = (formElement) => {
  const results = [];

  formElement.querySelectorAll(SELECTORS.SELECT).forEach((select) => {
    if (select.selectedIndex <= 0) return;
    if (isConditionallyHidden(select)) return;

    const option = select.selectedOptions[0];
    // Use data-choice-label for a clean name (no price string appended).
    // Fall back to textContent if the attribute is missing (old markup).
    const choiceLabel = option.dataset.choiceLabel || option.textContent.trim();
    results.push({
      type:        'select',
      name:        select.name,
      label:       getLabelFromGroup(select, select.name),
      value:       choiceLabel,
      price:       parseFloatSafe(option.dataset.price),
      optionLabel: choiceLabel,
      qty:         1,
    });
  });

  return results;
};

// ============================================================================
// TOGGLE / SWITCH
// ============================================================================

/**
 * Collect all checked toggle inputs.
 *
 * @param {HTMLElement} formElement
 * @returns {Array}
 */
export const processSwitchInputs = (formElement) => {
  const results = [];

  formElement.querySelectorAll(`${SELECTORS.TOGGLE}:checked`).forEach((tog) => {
    if (isConditionallyHidden(tog)) return;
    results.push(processCheckableInput(tog, 'toggle', findQtyInput(tog)));
  });

  return results;
};
