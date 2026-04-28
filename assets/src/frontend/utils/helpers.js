/**
 * Helper utility functions
 */

/**
 * Parse an integer safely with a fallback.
 *
 * @param {string|number} value    - Value to parse.
 * @param {number}        fallback - Returned when parsing fails.
 * @returns {number}
 */
export const parseIntSafe = (value, fallback = 0) => parseInt(value, 10) || fallback;

/**
 * Parse a float safely with a fallback.
 *
 * @param {string|number} value    - Value to parse.
 * @param {number}        fallback - Returned when parsing fails.
 * @returns {number}
 */
export const parseFloatSafe = (value, fallback = 0) => parseFloat(value) || fallback;

/**
 * Determine whether a form element is marked as required.
 * Reads data-required="1" (new schema) with backward-compat for "true".
 *
 * @param {HTMLElement} element
 * @returns {boolean}
 */
export const isRequired = (element) => {
  const val = element.dataset.required;
  return val === '1' || val === 'true' || element.hasAttribute('required');
};

/**
 * Smooth-scroll to the first error element in a form.
 *
 * @param {HTMLElement} formElement - The addon form element.
 */
export const scrollToFirstError = (formElement) => {
  const firstError = formElement.querySelector(
    '.opt-field--error, .opt-group--error, .opt-fieldset--error'
  );
  if (firstError) {
    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
};
