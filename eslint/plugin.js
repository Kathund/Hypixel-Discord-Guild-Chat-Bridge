import enforceNoConsoleLog from './rules/enforceNoConsoleLog.js';
import enforceTranslate from './rules/enforceTranslate.js';

export default {
  rules: {
    'enforce-translate': enforceTranslate,
    'enforce-no-console-log': enforceNoConsoleLog
  }
};
