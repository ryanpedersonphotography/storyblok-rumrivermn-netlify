/**
 * Style Dictionary Configuration
 * Generates CSS custom properties from DTCG token JSON
 *
 * Docs: https://amzn.github.io/style-dictionary/
 */

module.exports = {
  source: ['tokens/design-tokens.json'],
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'src/styles/tokens/',
      files: [
        {
          destination: 'tokens.css',
          format: 'css/variables',
          options: {
            outputReferences: true,
            selector: ':root'
          }
        }
      ],
      // Custom transforms for OKLCH colors
      transforms: [
        'attribute/cti',
        'name/cti/kebab',
        'time/seconds',
        'content/icon',
        'size/rem',
        'color/css'
      ]
    }
  }
};
