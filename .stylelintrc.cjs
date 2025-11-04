module.exports = {
  extends: ['stylelint-config-standard'],
  plugins: ['stylelint-declaration-strict-value'],
  rules: {
    // Disable standard rules that cause noise
    'color-hex-length': null,
    'color-function-notation': null,
    'alpha-value-notation': null,
    'hue-degree-notation': null,
    'color-function-alias-notation': null,
    'selector-class-pattern': null,
    'import-notation': null,
    'comment-empty-line-before': null,
    'value-keyword-case': null,
    'declaration-block-single-line-max-declarations': null,
    'media-feature-range-notation': null,
    'no-descending-specificity': null,
    'custom-property-pattern': null,
    'property-no-vendor-prefix': null,
    'font-family-name-quotes': null,
    'shorthand-property-no-redundant-values': null,
    'rule-empty-line-before': null,
    'at-rule-empty-line-before': null,
    'property-no-deprecated': null,
    'keyframes-name-pattern': null,
    'lightness-notation': null,

    // Require tokens for spacing properties only
    // Allow: 0, auto, inherit as these are CSS keywords
    // Allow: clamp/calc/min/max functions (they can contain tokens)
    'scale-unlimited/declaration-strict-value': [
      ['/^gap$/', '/^margin/', '/^padding/'],
      {
        ignoreValues: ['0', 'auto', 'inherit'],
        disableFix: true
      }
    ]
  },

  // File-specific overrides
  overrides: [
    {
      // Prevent base-level html/body selectors in component-layer files
      // Rationale: html/body should only be styled in @layer base (globals.css)
      // to avoid overriding critical base styles like scrollbar-gutter
      files: ['src/styles/primitives/**/*.css', 'src/styles/components/**/*.css'],
      rules: {
        'selector-disallowed-list': [
          ['/^html$/', '/^body$/'],
          {
            message: 'Base-level html/body selectors not allowed in component layers. Use globals.css @layer base instead to prevent cascade conflicts.'
          }
        ]
      }
    }
  ]
}
