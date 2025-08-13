import { ESLintUtils } from '@typescript-eslint/utils';

const createRule = ESLintUtils.RuleCreator((name) => name);
const defaultOptions = [{ always: true }];

export default createRule({
  name: 'eslint-enforce-no-console-log',
  defaultOptions,
  meta: {
    docs: { description: 'stop using console.log and use console.other' },
    messages: {
      consoleLog: "Don't use console.log as it isn't tracked by the logger. Use console.other instead"
    },
    schema: [],
    type: 'problem',
    fixable: 'code'
  },

  create(context) {
    return {
      /**
       * @param {import("@typescript-eslint/utils").TSESTree.ExpressionStatement} node
       * @returns void
       */
      ExpressionStatement(node) {
        if (!node.expression?.callee?.object?.name || node.expression.callee.object.name !== 'console') return;
        if (!node.expression?.callee?.property?.name || node.expression.callee.property.name !== 'log') return;
        const sourceCode = context.sourceCode.getText(node);
        context.report({
          node,
          messageId: 'consoleLog',
          fix: (fixer) => {
            return fixer.replaceText(node, sourceCode.replace(/\bconsole\.log\b/g, 'console.other'));
          }
        });
      }
    };
  }
});
