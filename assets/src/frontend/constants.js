/**
 * Constants used throughout the optiontics frontend.
 * Updated to match the new opt-* CSS class schema and data-* attribute names.
 */

export const SELECTORS = {
  // Form wrapper — emitted by Product_Form_View::build_form_html()
  ADDON_FORM: '.opt-addon-form',

  // Field group wrappers (fieldset for checkbox/radio, div for others)
  FIELD_GROUP: '.opt-field, .opt-group, .opt-fieldset',

  // Quantity inputs — emitted by Dom_Utilities::quantity_input()
  QUANTITY_INPUT: '.opt-qty-input',

  // Simple text-like inputs
  TEXT_INPUTS: 'input.opt-text-input, textarea.opt-textarea, input.opt-tel-input, input.opt-number-input, input.opt-email-input',

  // Email input (dedicated for format validation)
  EMAIL: 'input.opt-email-input',

  // Select dropdown
  SELECT: 'select.opt-select',

  // Radio / checkbox inputs (inside their respective choice wrappers).
  // Button Group also emits one of these wrapper classes on each choice so
  // the existing pipelines match without any selector juggling.
  RADIO: '.opt-choice--radio input[type="radio"]',
  CHECKBOX: '.opt-choice--checkbox input[type="checkbox"]',

  // Toggle/switch input — emitted by toggle.php
  TOGGLE: '.opt-toggle-input',

  // Choice wrapper (used for qty lookup)
  CHOICE_ITEM: '.opt-choice',

  // Validation state
  ERROR_GROUP: '.opt-field--error, .opt-group--error, .opt-fieldset--error',
  ERROR_MESSAGE: '.opt-field-error',

  // WooCommerce cart form
  CART_FORM: 'form.cart',

  // WooCommerce product quantity input (inside cart form)
  PRODUCT_QTY: 'form.cart input.qty, form.cart input[name="quantity"]',

  // Price summary elements — IDs kept stable (used by WC JS too)
  TOTAL_DISPLAY: '#optiontics_option_total_price',
  ADDON_PRICE_DISPLAY: '#optiontics_option_price',
};

export const DEFAULT_VALUES = {
  MIN_QUANTITY: 1,
  MAX_QUANTITY: 100,
  DECIMALS: 2,
  DECIMAL_SEPARATOR: '.',
  THOUSAND_SEPARATOR: ',',
  CURRENCY_SYMBOL: '$',
  SYMBOL_POSITION: '%1$s%2$s',
};

/**
 * Simple text-like input configs.
 * Selector, type slug (matches PHP field_type()), and fallback name.
 */
export const INPUT_CONFIGS = [
  { selector: 'input.opt-text-input',   type: 'textfield',  defaultName: 'custom_text' },
  { selector: 'textarea.opt-textarea',  type: 'textarea',   defaultName: 'custom_textarea' },
  { selector: 'input.opt-tel-input',    type: 'telephone',  defaultName: 'custom_telephone' },
  { selector: 'input.opt-number-input', type: 'number',     defaultName: 'custom_number' },
  { selector: 'input.opt-email-input',  type: 'email',      defaultName: 'custom_email' },
];
