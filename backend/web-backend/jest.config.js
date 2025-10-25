module.exports = {
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
  moduleFileExtensions: ['js', 'jsx', 'json', 'node'],
  coverageDirectory: 'coverage',
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/index.js',
    '!src/app.js',
    '!src/config/**',
    '!src/migrations/**',
    '!src/tests/**',
    '!src/utils/sendResponse.js',
  ],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
};