module.exports = {
  testEnvironment: 'jsdom', // jsdom
  // timers: 'fake',
  // resetMocks: false,
  setupFiles: ['<rootDir>/scripts/testSetup.js'],
  testMatch: [
    // '<rootDir>/**/__tests__/**/?(*.)(spec|test).js',
    // '<rootDir>/**/?(*.)(spec|test).js',
    // '<rootDir>/packages/demo-jest/__tests__/*.test.js',
    // '<rootDir>/packages/request/__tests__/bridge-ready.test.js',
    // '<rootDir>/packages/request/__tests__/*.test.js',
    '<rootDir>/packages/**/__tests__/*.test.js',
    // '!**/adapter.test.js',
    // '!**/session.test.js',
  ],
  transform: {
    '^.+\\.jsx?$': 'babel-jest', // 这个是jest的默认配置
    '^.+\\.tsx?$': 'ts-jest', // typescript转换
  },
  moduleNameMapper: {
    // '^image![a-zA-Z0-9$_-]+$': 'GlobalImageStub',
    // '^[./a-zA-Z0-9$_-]+\\.png$': '<rootDir>/RelativeImageStub.js',
    // 'module_name_(.*)': '<rootDir>/substituted_module_$1.js',
    // 'assets/(.*)': [
    //   '<rootDir>/images/$1',
    //   '<rootDir>/photos/$1',
    //   '<rootDir>/recipes/$1'
    // ],
    '^@/(.*)$': '<rootDir>/packages/demo-jest/src/$1',
  },
  // testResultsProcessor: 'jest-sonar-reporter',
  collectCoverage: true,
  // 'coverageReporters': [
  //   'json',
  //   ['lcov', {projectRoot: './test'}]
  // ],
  testURL: 'http://localhost?p_u=p_u&p_s=p_s&p_t=p_t',
};
