/**
 * Form field validators
 */

import { SELECTORS } from '../constants.js';
import { getLabelFromGroup } from '../utils/dom.js';
import { isRequired } from '../utils/helpers.js';

/**
 * Resolve the error-state class for a field group element.
 * fieldset → opt-fieldset--error, div.opt-group → opt-group--error, otherwise opt-field--error.
 *
 * @param {HTMLElement} group
 * @returns {string}
 */
const errorClassFor = (group) => {
  if (group.tagName === 'FIELDSET') return 'opt-fieldset--error';
  if (group.classList.contains('opt-group'))    return 'opt-group--error';
  return 'opt-field--error';
};

/**
 * Shows error message for a field or field group
 * @param {HTMLElement} element - The element to show error for
 * @param {string} message - Error message to display
 */
export const showFieldError = (element, message = '') => {
  const group = element.closest(SELECTORS.FIELD_GROUP);
  if (!group) return;

  group.classList.add(errorClassFor(group));

  let errorElement = group.querySelector(SELECTORS.ERROR_MESSAGE);
  if (!errorElement) {
    errorElement = document.createElement('div');
    errorElement.className = 'opt-field-error';
    group.appendChild(errorElement);
  }

  errorElement.textContent = message || 'This field is required';
  errorElement.style.display = 'block';
};

/**
 * Removes error state from a field or field group
 * @param {HTMLElement} element - The element to clear error for
 */
export const clearFieldError = (element) => {
  const group = element.closest(SELECTORS.FIELD_GROUP);
  if (!group) return;

  group.classList.remove('opt-field--error', 'opt-group--error', 'opt-fieldset--error');

  const errorElement = group.querySelector(SELECTORS.ERROR_MESSAGE);
  if (errorElement) {
    errorElement.style.display = 'none';
  }
};

/**
 * Clears all validation errors from the form
 * @param {HTMLElement} formElement - The addon form element
 */
export const clearAllErrors = (formElement) => {
  formElement.querySelectorAll(SELECTORS.ERROR_GROUP).forEach((group) => {
    group.classList.remove('opt-field--error', 'opt-group--error', 'opt-fieldset--error');
    const errorElement = group.querySelector(SELECTORS.ERROR_MESSAGE);
    if (errorElement) {
      errorElement.style.display = 'none';
    }
  });
};

/**
 * Validates a single text input field (text, textarea, tel, number)
 * @param {HTMLElement} input - Input element to validate
 * @returns {boolean} True if valid, false otherwise
 */
export const validateTextInput = (input) => {
  if (!isRequired(input)) {
    clearFieldError(input);
    return true;
  }

  const value = input.value.trim();
  if (value === '') {
    const label = getLabelFromGroup(input, input.name || 'Field');
    showFieldError(input, `${label} is required`);
    return false;
  }

  clearFieldError(input);
  return true;
};

// Common free/personal mail providers rejected when businessOnly is set.
const FREE_EMAIL_DOMAINS = new Set([
  'gmail.com',
  'googlemail.com',
  'yahoo.com',
  'yahoo.co.uk',
  'yahoo.co.in',
  'ymail.com',
  'hotmail.com',
  'outlook.com',
  'live.com',
  'msn.com',
  'aol.com',
  'icloud.com',
  'me.com',
  'mac.com',
  'protonmail.com',
  'proton.me',
  'gmx.com',
  'gmx.net',
  'mail.com',
  'yandex.com',
  'zoho.com',
]);

// RFC 5322-lite: good enough for client-side rejection of obvious typos.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validates an email input: required-ness, format, and optional business-only
 * rule (data-business-only="1" rejects common free webmail domains).
 *
 * @param {HTMLInputElement} input
 * @returns {boolean}
 */
export const validateEmailInput = (input) => {
  const value = input.value.trim();
  const label = getLabelFromGroup(input, input.name || 'Email');

  if (value === '') {
    if (isRequired(input)) {
      showFieldError(input, `${label} is required`);
      return false;
    }
    clearFieldError(input);
    return true;
  }

  if (!EMAIL_PATTERN.test(value)) {
    showFieldError(input, `Please enter a valid email address`);
    return false;
  }

  if (input.dataset.businessOnly === '1') {
    const domain = value.split('@')[1]?.toLowerCase() ?? '';
    if (FREE_EMAIL_DOMAINS.has(domain)) {
      showFieldError(input, `Please use a business email address`);
      return false;
    }
  }

  clearFieldError(input);
  return true;
};

/**
 * Validates a select dropdown field
 * @param {HTMLElement} select - Select element to validate
 * @returns {boolean} True if valid, false otherwise
 */
export const validateSelectInput = (select) => {
  if (!isRequired(select)) {
    clearFieldError(select);
    return true;
  }

  if (select.selectedIndex === 0) {
    const label = getLabelFromGroup(select, select.name || 'Field');
    showFieldError(select, `Please select an option for ${label}`);
    return false;
  }

  clearFieldError(select);
  return true;
};

/**
 * Validates radio button group (at least one must be selected)
 * @param {HTMLElement} formElement - Form element containing radio buttons
 * @param {HTMLElement} radioGroup - The field group containing radio buttons
 * @returns {boolean} True if valid, false otherwise
 */
export const validateRadioGroup = (formElement, radioGroup) => {
  const radios = radioGroup.querySelectorAll('input[type="radio"][data-required="1"]');
  if (radios.length === 0) return true;

  const groupName = radios[0]?.name;
  if (!groupName) return true;

  const checkedRadio = formElement.querySelector(`input[type="radio"][name="${groupName}"]:checked`);

  if (!checkedRadio) {
    const label = getLabelFromGroup(radios[0], groupName);
    showFieldError(radios[0], `Please select an option for ${label}`);
    return false;
  }

  clearFieldError(radios[0]);
  return true;
};

/**
 * Validates checkbox group (at least one must be checked if required)
 * @param {HTMLElement} checkboxGroup - The field group containing checkboxes
 * @returns {boolean} True if valid, false otherwise
 */
export const validateCheckboxGroup = (checkboxGroup) => {
  const checkboxes = checkboxGroup.querySelectorAll('input[type="checkbox"][data-required="1"]');
  if (checkboxes.length === 0) return true;

  const hasChecked = Array.from(checkboxes).some((cb) => cb.checked);

  if (!hasChecked) {
    const label = getLabelFromGroup(checkboxes[0], 'Field');
    showFieldError(checkboxes[0], `Please select at least one option for ${label}`);
    return false;
  }

  clearFieldError(checkboxes[0]);
  return true;
};

/**
 * Validates toggle/switch field
 * @param {HTMLElement} toggleField - Toggle input element to validate
 * @returns {boolean} True if valid, false otherwise
 */
export const validateSwitchInput = (toggleField) => {
  if (!isRequired(toggleField)) {
    clearFieldError(toggleField);
    return true;
  }

  if (!toggleField.checked) {
    const label = getLabelFromGroup(toggleField, toggleField.name || 'Field');
    showFieldError(toggleField, `${label} is required`);
    return false;
  }

  clearFieldError(toggleField);
  return true;
};

/**
 * Validates all required fields in the addon form
 * @param {HTMLElement} formElement - The addon form element
 * @returns {boolean} True if all validations pass, false otherwise
 */
export const validateAddonForm = (formElement) => {
  let isValid = true;

  // Conditionally hidden wrappers skip validation — their "required"
  // contract doesn't apply while the UI is hiding the field from the user.
  const inVisibleGroup = (el) =>
    el.closest('[data-condition-hidden="1"]') === null;

  
  // Text inputs (required only)
  formElement
    .querySelectorAll(`${SELECTORS.TEXT_INPUTS}[data-required="1"]`)
    .forEach((input) => {
      // Delegate email inputs to their dedicated validator so the required
      // path also enforces format + business-only rules.
      if (input.classList.contains('opt-email-input')) {
        if (!validateEmailInput(input)) isValid = false;
      } else if (!validateTextInput(input)) {
        isValid = false;
      }
    });

  // Email inputs (optional ones still need format/business-only checks when filled)
  formElement.querySelectorAll(`${SELECTORS.EMAIL}:not([data-required="1"])`).forEach((input) => {
    if (!validateEmailInput(input)) isValid = false;
  });

  // Select dropdowns
  formElement.querySelectorAll(`${SELECTORS.SELECT}[data-required="1"]`).forEach((select) => {
    if (!inVisibleGroup(select)) return;
    if (!validateSelectInput(select)) isValid = false;
  });

  // Radio groups — iterate field groups that contain a required radio
  formElement.querySelectorAll(SELECTORS.FIELD_GROUP).forEach((group) => {
    if (!inVisibleGroup(group)) return;
    if (group.querySelector('input[type="radio"][data-required="1"]')) {
      if (!validateRadioGroup(formElement, group)) isValid = false;
    }
  });

  // Checkbox groups — iterate field groups that contain a required checkbox
  formElement.querySelectorAll(SELECTORS.FIELD_GROUP).forEach((group) => {
    if (!inVisibleGroup(group)) return;
    if (group.querySelector('input[type="checkbox"][data-required="1"]')) {
      if (!validateCheckboxGroup(group)) isValid = false;
    }
  });

  // Toggle/switch fields
  formElement.querySelectorAll(`${SELECTORS.TOGGLE}[data-required="1"]`).forEach((tog) => {
    if (!inVisibleGroup(tog)) return;
    if (!validateSwitchInput(tog)) isValid = false;
  });

  return isValid;
};
