export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'refactor', 'perf', 'test', 'docs', 'style', 'build', 'ci', 'revert'],
    ],
    'header-max-length': [2, 'always', 50],
    'subject-case': [2, 'always', 'lower-case'],
  },
};
