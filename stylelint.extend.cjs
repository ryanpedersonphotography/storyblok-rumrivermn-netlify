// Non-disruptive Stylelint extender that bans rgba() with alpha.
// Use via: npx stylelint 'src/**/*.css' --config stylelint.extend.cjs

module.exports = {
  rules: {
    "declaration-property-value-disallowed-list": {
      "/.*/": [/rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*0?\.?\d+\s*\)/i],
    },
  },
};
