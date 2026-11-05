module.exports = {
  preset: "jest-expo",
  clearMocks: true,
  collectCoverage: false,
  testMatch: ["**/*.test.ts?(x)"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/../../Mobile/src/$1",
    "^@backlog-defeater/api-client$": "<rootDir>/../../packages/api-client/src/index.ts",
    "^expo-router$": "<rootDir>/mocks/expo-router.cjs",
  },
};
