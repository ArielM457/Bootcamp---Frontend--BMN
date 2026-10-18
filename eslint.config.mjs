import angular from 'angular-eslint';

export default [
  ...angular.configs.tsRecommended.map((config) => ({ ...config, files: ['**/*.ts'] })),
  ...angular.configs.templateRecommended.map((config) => ({ ...config, files: ['**/*.html'] })),
  { ignores: ['dist/**', '.angular/**', 'coverage/**'] },
];
