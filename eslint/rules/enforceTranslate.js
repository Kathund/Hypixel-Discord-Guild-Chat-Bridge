import { ESLintUtils } from '@typescript-eslint/utils';

const createRule = ESLintUtils.RuleCreator((name) => name);
const defaultOptions = [{ always: true }];

export default createRule({
  name: 'eslint-enforce-translate',
  defaultOptions,
  meta: {
    docs: { description: 'enforce using the Translate function' },
    messages: {
      missingTranslate: 'Use the translate function when parsing in strings for the end user'
    },
    schema: [],
    type: 'problem'
  },

  create(context) {
    /**
     * @param {import("@typescript-eslint/utils").TSESTree.CallExpression} argument
     * @returns boolean
     */
    function checkReplaceVariables(argument) {
      if (argument.type === 'CallExpression') return false;
      if (argument.callee.name === 'Translate') return false;
      return true;
    }

    /**
     * @param {import("@typescript-eslint/utils").TSESTree.CallExpression} argument
     * @returns boolean
     */
    function checkArgument(argument) {
      if (argument.type !== 'CallExpression') return true;
      if (argument.callee.name === 'ReplaceVariables') {
        return checkReplaceVariables(argument.arguments[0]);
      }
      if (argument.callee.name !== 'Translate') {
        return true;
      }
      return false;
    }

    /**
     * @param {import("@typescript-eslint/utils").TSESTree.CallExpression} expression
     * @returns boolean
     */
    function handleCallExpression(expression) {
      if (expression.callee.type !== 'MemberExpression') return false;
      if (
        expression.callee.object !== undefined &&
        expression.callee.object.type === 'NewExpression' &&
        expression.callee.object.callee !== undefined &&
        expression.callee.object.callee.type === 'Identifier' &&
        expression.callee.object.callee.name === 'Embed' &&
        expression.callee.object.parent !== undefined &&
        expression.callee.object.parent.type === 'MemberExpression' &&
        expression.callee.object.parent.property !== undefined &&
        expression.callee.object.parent.property.type === 'Identifier' &&
        ['setTitle', 'setDescription'].includes(expression.callee.object.parent.property.name)
      ) {
        return checkArgument(expression.arguments[0]);
      }
      if (
        expression.callee.object.name === 'console' &&
        ['log', 'error'].includes(expression.callee.property.name) === false
      ) {
        return checkArgument(expression.arguments[0]);
      }
      return false;
    }

    return {
      /**
       * @param {import("@typescript-eslint/utils").TSESTree.ExpressionStatement} node
       * @returns void
       */
      ExpressionStatement(node) {
        if (node.expression === undefined) return;
        if (node.expression.type === 'CallExpression') {
          if (handleCallExpression(node.expression)) context.report({ node, messageId: 'missingTranslate' });
        }
      }
    };
  }
});
