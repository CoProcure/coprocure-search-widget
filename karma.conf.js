/* eslint-disable import/no-extraneous-dependencies */
const createDefaultConfig = require('@open-wc/testing-karma/default-config');
const merge = require('webpack-merge');

module.exports = config => {
  config.set(
    merge(createDefaultConfig(config), {
      files: [
        // runs all files ending with .test in the test folder,
        // can be overwritten by passing a --grep flag. examples:
        //
        // npm run test -- --grep test/foo/bar.test.js
        // npm run test -- --grep test/bar/*
        config.grep ? config.grep : 'test/**/*.test.js',
      ],

      captureTimeout: 60000,
      browserNoActivityTimeout: 60000,

      // you can overwrite/extend the config further
      // ## code coverage config
      coverageIstanbulReporter: {
        reports: ['html', 'lcovonly', 'text-summary'],
        dir: 'coverage',
        combineBrowserReports: true,
        skipFilesWithNoCoverage: false,
        thresholds: {
          global: {
            statements: 20,
            branches: 10,
            functions: 20,
            lines: 20,
          },
        },
      },
    }),
  );
  return config;
};