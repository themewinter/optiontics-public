/**
 * Conditional-logic evaluator.
 *
 * Walks every field wrapper that opted into conditional logic
 * (`data-logic-enabled="1"`) and toggles its visibility based on the
 * current values of the fields referenced in its rules array.
 *
 * Data contract (set in PHP by Dom_Utilities::field_wrapper_attrs):
 *   data-logic-enabled        "1" when rules should run
 *   data-conditions           JSON array of { field, compare, value }
 *   data-condition-visibility "show" | "hide" (action when rules match)
 *   data-condition-match      "all" | "any"   (AND | OR combinator)
 *
 * Each referenced field is located via `[data-node-id="…"]` on the wrapper
 * that PHP rendered for it. Choice-based inputs expose the selected label
 * via `data-choice-label`; other inputs (text / textarea / number / tel)
 * are read from `.value`.
 */

/** @type {string} CSS class toggled on wrappers to hide them visually. */
const HIDDEN_CLASS = 'opt-field--condition-hidden';

/**
 * Read the current value(s) of a field, identified by its node id.
 * Returns '' when nothing is selected, a string for single-value fields,
 * or an array of strings for multi-value checkboxes.
 *
 * @param {HTMLElement} formElement
 * @param {string} nodeId
 * @returns {string | string[]}
 */
const getFieldValue = (formElement, nodeId) => {
  if (!nodeId) return '';
  const group = formElement.querySelector(
    `[data-node-id="${CSS.escape(nodeId)}"]`,
  );
  if (!group) return '';

  // Multi: every checked checkbox contributes.
  const checkboxes = group.querySelectorAll(
    'input[type="checkbox"].opt-choice__input:checked',
  );
  if (checkboxes.length > 0) {
    return Array.from(checkboxes).map(
      (cb) => cb.dataset.choiceLabel || cb.value || '',
    );
  }

  // Single radio pick.
  const radio = group.querySelector('input[type="radio"]:checked');
  if (radio) return radio.dataset.choiceLabel || radio.value || '';

  // Toggle: present only when checked.
  const toggle = group.querySelector('input.opt-toggle-input');
  if (toggle) return toggle.checked ? toggle.dataset.choiceLabel || 'yes' : '';

  // Select dropdown.
  const select = group.querySelector('select.opt-select');
  if (select) {
    if (select.selectedIndex <= 0) return '';
    const opt = select.selectedOptions[0];
    return (opt && opt.dataset.choiceLabel) || '';
  }

  // Text-like inputs.
  const input = group.querySelector(
    'input.opt-text-input, input.opt-tel-input, input.opt-number-input, textarea.opt-textarea',
  );
  if (input) return String(input.value || '').trim();

  return '';
};

/** Normalise a field value into an array of trimmed strings. */
const toStrArray = (v) => {
  if (Array.isArray(v)) return v.map((x) => String(x).trim());
  return [String(v ?? '').trim()];
};

/** Case-insensitive string comparison helpers. */
const eqInsensitive = (a, b) => a.toLowerCase() === b.toLowerCase();

/** Evaluate a single rule against the current field value. */
const evalRule = (fieldValue, operator, targetValue) => {
  const values = toStrArray(fieldValue);
  const target =
    Array.isArray(targetValue) ? targetValue.map((v) => String(v).trim()) : String(targetValue ?? '').trim();

  switch (operator) {
    case 'is':
      return values.some((v) => eqInsensitive(v, String(target)));
    case 'not_is':
      return !values.some((v) => eqInsensitive(v, String(target)));

    case 'in': {
      const list = Array.isArray(target) ? target : String(target).split(',').map((s) => s.trim());
      return list.some((t) => values.some((v) => eqInsensitive(v, t)));
    }
    case 'not_in': {
      const list = Array.isArray(target) ? target : String(target).split(',').map((s) => s.trim());
      return !list.some((t) => values.some((v) => eqInsensitive(v, t)));
    }

    case 'contains':
      return values.some((v) => v.toLowerCase().includes(String(target).toLowerCase()));
    case 'not_contains':
      return !values.some((v) => v.toLowerCase().includes(String(target).toLowerCase()));

    case 'greater_than':
      return values.some((v) => parseFloat(v) > parseFloat(target));
    case 'less_than':
      return values.some((v) => parseFloat(v) < parseFloat(target));
    case 'greater_equal':
      return values.some((v) => parseFloat(v) >= parseFloat(target));
    case 'less_equal':
      return values.some((v) => parseFloat(v) <= parseFloat(target));

    default:
      return false;
  }
};

/** Apply conditions to one field wrapper. */
const applyFieldConditions = (formElement, wrapper) => {
  if (wrapper.dataset.logicEnabled !== '1') return;

  let rules = [];
  try {
    rules = JSON.parse(wrapper.dataset.conditions || '[]');
  } catch (_err) {
    rules = [];
  }
  if (!Array.isArray(rules) || rules.length === 0) return;

  const visibility = wrapper.dataset.conditionVisibility || 'show';
  const match = wrapper.dataset.conditionMatch || 'all';

  const results = rules
    .map((rule) => {
      if (!rule || !rule.field || !rule.compare) return null;
      const currentValue = getFieldValue(formElement, rule.field);
      return evalRule(currentValue, rule.compare, rule.value);
    })
    .filter((r) => r !== null);

  if (results.length === 0) return;

  const allTrue = results.every(Boolean);
  const anyTrue = results.some(Boolean);
  const matched = match === 'any' ? anyTrue : allTrue;
  const shouldShow = visibility === 'show' ? matched : !matched;

  if (shouldShow) {
    wrapper.classList.remove(HIDDEN_CLASS);
    wrapper.dataset.conditionHidden = '0';
    wrapper.removeAttribute('aria-hidden');
  } else {
    wrapper.classList.add(HIDDEN_CLASS);
    wrapper.dataset.conditionHidden = '1';
    wrapper.setAttribute('aria-hidden', 'true');
  }
};

/** Re-evaluate every conditional field in the form. */
export const applyConditions = (formElement) => {
  if (!formElement) return;
  formElement
    .querySelectorAll('[data-logic-enabled="1"]')
    .forEach((wrapper) => applyFieldConditions(formElement, wrapper));
};
