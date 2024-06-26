/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["<rootDir>/src/**/*.test.ts"],
  modulePaths: ["<rootDir>/src"],
  modulePathIgnorePatterns: ["<rootDir>/dist", "<rootDir>/package.json"],
  testTimeout: 3000000
};
