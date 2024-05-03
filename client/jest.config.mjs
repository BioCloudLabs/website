// jest.config.mjs
export default {
  preset: 'ts-jest/presets/default-esm', // Ensures ts-jest uses ESM presets
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['./setupTests.mjs'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  transform: {
    '^.+\\.tsx?$': 'ts-jest', // Ensuring ts-jest is used for tsx and ts files
  },
  globals: {
    'ts-jest': {
      useESM: true
    }
  },
  transformIgnorePatterns: [
    '/node_modules/',
  ],
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
};
