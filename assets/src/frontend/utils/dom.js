/**
 * DOM manipulation utilities
 * Updated to use new opt-* class schema and data-* attribute names.
 */

import { SELECTORS } from '../constants.js';
import { parseFloatSafe } from './helpers.js';

/**
 * Find the nearest field-group wrapper from any element inside a field unit.
 * Supports fieldset (checkbox/radio) and div (all others).
 *
 * @param {HTMLElement} element - Any element inside a field unit.
 * @returns {HTMLElement|null}
 */
export const getFieldGroup = (element) => {
  return element.closest('.opt-field, .opt-group, .opt-fieldset') || null;
};

/**
 * Extract the field title from the nearest field-group wrapper.
 * Reads the legend (fieldset) or label/div.opt-field__label text,
 * strips the required asterisk, and returns clean text.
 *
 * @param {HTMLElement} element      - Element inside the field unit.
 * @param {string}      fallbackName - Returned when no label is found.
 * @returns {string}
 */
export const getLabelFromGroup = (element, fallbackName = '') => {
  const group = getFieldGroup(element);
  if (!group) return fallbackName || element.name || '';

  // fieldset uses <legend>; div-based groups use .opt-field__label
  const labelEl = group.querySelector('legend.opt-field__label, .opt-field__label');
  if (!labelEl) return fallbackName || element.name || '';

  // Strip required asterisk (*) and the .opt-field__required span text
  const clone = labelEl.cloneNode(true);
  clone.querySelectorAll('.opt-field__required').forEach((n) => n.remove());
  return clone.textContent.trim() || fallbackName;
};

/**
 * Extract the visible text of a choice label, skipping input and img children.
 *
 * @param {HTMLElement} inputEl      - Checkbox or radio input element.
 * @param {string}      fallbackLabel - Returned when no label is found.
 * @returns {string}
 */
export const getOptionLabelFromInput = (inputEl, fallbackLabel = '') => {
  // In opt-* templates the <label> is a sibling (for= attribute), not a wrapper.
  // Try ancestor first (old templates), then sibling via for-attribute, then .opt-choice__label sibling.
  const labelEl =
    inputEl?.closest('label') ||
    (inputEl?.id
      ? inputEl.closest('.opt-choice')?.querySelector(`label[for="${CSS.escape(inputEl.id)}"]`)
      : null) ||
    inputEl?.closest('.opt-choice')?.querySelector('.opt-choice__label');
  if (!labelEl) return fallbackLabel;

  const SKIP_TAGS = new Set(['INPUT', 'IMG']);
  let text = '';
  const stack = [labelEl];

  while (stack.length > 0) {
    const node = stack.pop();
    if (node.nodeType === Node.TEXT_NODE) {
      text += node.textContent;
      continue;
    }
    if (node.nodeType === Node.ELEMENT_NODE && !SKIP_TAGS.has(node.tagName)) {
      // Push children in reverse so leftmost is processed first
      for (let i = node.childNodes.length - 1; i >= 0; i--) {
        stack.push(node.childNodes[i]);
      }
    }
  }

  return text.trim() || fallbackLabel;
};

/**
 * Create or retrieve the hidden input that carries addon JSON to the server.
 *
 * @param {Document|HTMLElement} context     - DOM root to search in.
 * @param {HTMLElement}          formElement - The opt-addon-form element.
 * @returns {HTMLInputElement}
 */
export const getOrCreateHiddenInput = (context, formElement) => {
  let hiddenInput = context.querySelector('input[name="addon_data_json"]');

  if (!hiddenInput) {
    hiddenInput = document.createElement('input');
    hiddenInput.type = 'hidden';
    hiddenInput.name = 'addon_data_json';
    formElement.closest(SELECTORS.CART_FORM)?.appendChild(hiddenInput);
  }

  return hiddenInput;
};

/**
 * Collect the key DOM elements needed for price display and calculation.
 *
 * @param {Document|HTMLElement} context - DOM root.
 * @returns {{ addonForm, totalDisplay, addonTotalPrice, productPrice }}
 */
export const getDOMElements = (context) => {
  const addonForm       = context.querySelector(SELECTORS.ADDON_FORM);
  const totalDisplay    = context.querySelector(SELECTORS.TOTAL_DISPLAY);
  const addonTotalPrice = context.querySelector(SELECTORS.ADDON_PRICE_DISPLAY);
  // data-base is the attribute emitted by Product_Form_View::price_summary_html()
  const productPrice    = totalDisplay
    ? parseFloatSafe(totalDisplay.dataset.base ?? totalDisplay.dataset.price)
    : 0;
  const productQtyInput = context.querySelector(SELECTORS.PRODUCT_QTY);

  return { addonForm, totalDisplay, addonTotalPrice, productPrice, productQtyInput };
};
