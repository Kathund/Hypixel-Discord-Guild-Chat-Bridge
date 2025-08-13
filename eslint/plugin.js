import enforceConfigNaming from './rules/enforceConfigNaming.js';
import enforceNoConsoleLog from './rules/enforceNoConsoleLog.js';
import enforceTranslate from './rules/enforceTranslate.js';

// eslint-disable-next-line
export default {
  rules: {
    'enforce-translate': enforceTranslate,
    'enforce-no-console-log': enforceNoConsoleLog,
    'enforce-config-naming': enforceConfigNaming
  }
};
