import { ESLintUtils } from '@typescript-eslint/utils';

const createRule = ESLintUtils.RuleCreator((name) => name);
const defaultOptions = [{ always: true }];

export default createRule({
  name: 'eslint-block-console-log',
  defaultOptions,
  meta: {
    docs: { description: 'stop using console.log and use console.other' },
    messages: {
      consoleLog: "Don't use console.log as it isn't tracked by the logger. Use console.other instead"
    },
    schema: [],
    type: 'layout'
  },

  create(context) {
    return {
      /**
       * @param {import("@typescript-eslint/utils").TSESTree.ExpressionStatement} node
       * @returns void
       */
      ExpressionStatement(node) {
        if (
          node.expression !== undefined &&
          node.expression.callee !== undefined &&
          node.expression.callee.object !== undefined &&
          node.expression.callee.object.name !== undefined &&
          node.expression.callee.object.name === 'console' &&
          node.expression.callee.property !== undefined &&
          node.expression.callee.property.name !== undefined &&
          node.expression.callee.property.name === 'log'
        ) {
          context.report({ node, messageId: 'consoleLog' });
        }
      }
    };
  }
});
