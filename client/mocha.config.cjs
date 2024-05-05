// mocha.config.cjs
module.exports = {
  recursive: true,
  extension: ['js'],  // Look for JavaScript files
  spec: 'dist/__tests__/**/*.{test.js}',  // Match .js test files
  require: [
    'jsdom-global/register'  // Simulate browser environment with jsdom
  ],
  reporter: 'spec',  // Use the spec reporter for test results
  ui: 'bdd',  // Use BDD-style for test suite
  watchFiles: ['dist/**/*.{js}']  // Watch for changes in JavaScript files
};