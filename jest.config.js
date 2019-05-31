module.exports = {
  clearMocks: true,
  coverageDirectory: "coverage",
  moduleNameMapper: {
    "^workerize-loader": "<rootDir>/src/__mocks__/worker.ts"
  }
};
