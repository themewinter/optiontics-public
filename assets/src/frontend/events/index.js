/**
 * Event handlers and listeners setup
 */

import { SELECTORS, DEFAULT_VALUES } from '../constants.js';
import { validateQuantity } from '../utils/validation.js';
import { isRequired } from '../utils/helpers.js';
import {
  showFieldError,
  validateTextInput,
  validateEmailInput,
  validateSelectInput,
  validateRadioGroup,
  validateCheckboxGroup,
  validateSwitchInput,
  validateAddonForm,
  clearAllErrors,
} from '../validators/index.js';
import { scrollToFirstError } from '../utils/helpers.js';

/**
 * Creates event handler for quantity input validation
 * @param {Function} calculateCallback - Callback to recalculate totals
 * @returns {Function} Event handler function
 */
export const createQuantityChangeHandler = (calculateCallback) => {
  return function () {
    validateQuantity(this);
    // Read native min/max attributes (set by Dom_Utilities::quantity_input())
    const minQty = parseInt(this.min || DEFAULT_VALUES.MIN_QUANTITY, 10);
    const maxQty = parseInt(this.max || DEFAULT_VALUES.MAX_QUANTITY, 10);

    if (this.value < minQty || this.value > maxQty) {
      showFieldError(this, `Quantity must be between ${minQty} and ${maxQty}`);
    }

    calculateCallback();
  };
};

/**
 * Creates event handler for quantity input blur
 * @param {Function} calculateCallback - Callback to recalculate totals
 * @returns {Function} Event handler function
 */
export const createQuantityBlurHandler = (calculateCallback) => {
  return function () {
    validateQuantity(this);
    calculateCallback();
  };
};

/**
 * Sets up event listeners for quantity inputs
 * @param {HTMLElement} formElement - The addon form element
 * @param {Function} calculateCallback - Callback to recalculate totals
 */
export const setupQuantityInputListeners = (formElement, calculateCallback) => {
  formElement.querySelectorAll(SELECTORS.QUANTITY_INPUT).forEach((qtyInput) => {
    qtyInput.addEventListener('change', createQuantityChangeHandler(calculateCallback));
    qtyInput.addEventListener('blur', createQuantityBlurHandler(calculateCallback));
  });
};

/**
 * Sets up event listeners for form inputs
 * @param {HTMLElement} formElement - The addon form element
 * @param {Function} calculateCallback - Callback to recalculate totals
 */
export const setupFormListeners = (formElement, calculateCallback) => {
  formElement.addEventListener('change', calculateCallback);
  formElement.addEventListener('input', calculateCallback);
};

/**
 * Sets up validation listeners for individual fields
 * @param {HTMLElement} formElement - The addon form element
 */
export const setupValidationListeners = (formElement) => {
  // Text inputs: validate on blur and change
  formElement.querySelectorAll(SELECTORS.TEXT_INPUTS).forEach((input) => {
    const isEmail = input.classList.contains('opt-email-input');
    const runValidate = () => (isEmail ? validateEmailInput(input) : validateTextInput(input));

    input.addEventListener('blur', function () {
      // Email fields validate format/business-only on every blur (even when
      // not required) so users catch typos before submitting.
      if (isEmail || isRequired(this)) runValidate();
    });
    input.addEventListener('change', function () {
      if (isEmail || isRequired(this)) runValidate();
    });
  });

  // Select dropdowns: validate on change
  formElement.querySelectorAll(SELECTORS.SELECT).forEach((select) => {
    select.addEventListener('change', function () {
      if (isRequired(this)) validateSelectInput(this);
    });
  });

  // Radio buttons: validate the containing field group on change
  formElement.querySelectorAll(SELECTORS.RADIO).forEach((radio) => {
    radio.addEventListener('change', function () {
      if (this.dataset.required === '1') {
        const group = this.closest(SELECTORS.FIELD_GROUP);
        if (group) validateRadioGroup(formElement, group);
      }
    });
  });

  // Checkboxes: validate the containing field group on change
  formElement.querySelectorAll(SELECTORS.CHECKBOX).forEach((checkbox) => {
    checkbox.addEventListener('change', function () {
      if (this.dataset.required === '1') {
        const group = this.closest(SELECTORS.FIELD_GROUP);
        if (group) validateCheckboxGroup(group);
      }
    });
  });

  // Toggle/switch: validate on change
  formElement.querySelectorAll(SELECTORS.TOGGLE).forEach((tog) => {
    tog.addEventListener('change', function () {
      if (isRequired(this)) validateSwitchInput(this);
    });
  });
};

/**
 * Handles form submission validation
 * @param {Event} e - Submit event
 * @param {HTMLElement} formElement - The addon form element
 * @returns {boolean} True if validation passes
 */
const handleFormSubmission = (e, formElement) => {
  if (!validateAddonForm(formElement)) {
    e.preventDefault();
    e.stopPropagation();
    scrollToFirstError(formElement);
    return false;
  }

  clearAllErrors(formElement);
  return true;
};

/**
 * Intercepts WooCommerce add to cart form submission
 * @param {HTMLElement} formElement - The addon form element
 */
export const interceptFormSubmission = (formElement) => {
  const cartForm = formElement.closest(SELECTORS.CART_FORM);
  if (!cartForm) return;

  cartForm.addEventListener('submit', (e) => handleFormSubmission(e, formElement));
};

/**
 * Creates a unified jQuery submit button handler
 * @param {jQuery.Event} e - Click event
 * @param {jQuery} $button - jQuery button element
 * @param {string} selector - Selector for addon form
 */
const handleJQuerySubmit = (e, $button, selector) => {
  const $form = $button.closest(SELECTORS.CART_FORM);
  const $addonForm = $form.find(selector);

  if ($addonForm.length > 0) {
    const addonForm = $addonForm[0];

    if (!validateAddonForm(addonForm)) {
      e.preventDefault();
      e.stopImmediatePropagation();
      scrollToFirstError(addonForm);
      return false;
    }

    clearAllErrors(addonForm);
  }
};

/**
 * Sets up jQuery event handlers for AJAX add to cart
 */
export const setupJQueryHandlers = () => {
  if (typeof jQuery === 'undefined') return;

  jQuery(document).on('click', 'button[type="submit"][name="add-to-cart"]', function (e) {
    handleJQuerySubmit(e, jQuery(this), SELECTORS.ADDON_FORM);
  });

  jQuery(document).on('click', '.single_add_to_cart_button', function (e) {
    handleJQuerySubmit(e, jQuery(this), SELECTORS.ADDON_FORM);
  });
};
