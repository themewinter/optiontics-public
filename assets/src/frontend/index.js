/**
 * Optiontics Frontend Script
 * Main entry point - Initializes addon form functionality
 */

import { getDOMElements, getOrCreateHiddenInput } from './utils/dom.js';
import { getCurrencySettings } from './utils/currency.js';
import { updatePriceDisplays } from './calculator/index.js';
import { applyConditions } from './conditions/index.js';
import {
  setupFormListeners,
  setupQuantityInputListeners,
  setupValidationListeners,
  interceptFormSubmission,
  setupJQueryHandlers,
} from './events/index.js';

/**
 * Initializes addon form functionality
 * Sets up event listeners, calculates initial totals, and prepares form
 * @param {Document|HTMLElement} context - DOM context (default: document)
 */
function initOptiontics(context = document) {
  const { addonForm, totalDisplay, addonTotalPrice, productPrice, productQtyInput } =
    getDOMElements(context);

  // Exit early if form not found
  if (!addonForm) return;

  // Get currency settings
  const currencySettings = getCurrencySettings(addonForm);

  // Get or create hidden input for storing addon data
  const hiddenInput = getOrCreateHiddenInput(context, addonForm);

  // Create calculation function with closure over required variables.
  // Conditional visibility runs first so calculator/validator see the
  // post-toggle DOM state (hidden fields are excluded downstream).
  const calculateAddonTotal = () => {
    applyConditions(addonForm);
     const productQty = productQtyInput ? productQtyInput.value : 1;
    updatePriceDisplays(
      addonForm,
      totalDisplay,
      addonTotalPrice,
      hiddenInput,
      productPrice,
      currencySettings,
      productQty
    );
  };

  // Set up event listeners
  setupFormListeners(addonForm, calculateAddonTotal);
  setupQuantityInputListeners(addonForm, calculateAddonTotal);
  setupValidationListeners(addonForm);
  interceptFormSubmission(addonForm);

  // Initial evaluation (applies conditions + calculates totals).
  // Recalculate when WooCommerce product quantity changes
  if (productQtyInput) {
    productQtyInput.addEventListener('change', calculateAddonTotal);
    productQtyInput.addEventListener('input', calculateAddonTotal);
  }

  // Calculate initial totals
  calculateAddonTotal();
}

// ============================================================================
// AUTO-INITIALIZATION
// ============================================================================

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => initOptiontics());

// Re-initialize when WooCommerce variation form changes (for variable products)
if (typeof jQuery !== 'undefined') {
  jQuery(document).on('wc_variation_form', function () {
    initOptiontics();
  });
}

// Set up jQuery handlers for AJAX add to cart
setupJQueryHandlers();
