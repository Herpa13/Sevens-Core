module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/*.e2e-spec.ts'],
  transformIgnorePatterns: ['/node_modules/(?!@sevens/shared|@sevens/db)'],
};
