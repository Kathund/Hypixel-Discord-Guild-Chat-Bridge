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
    function checkArgument(argument) {
      if (argument.type !== 'CallExpression') return true;
      if (argument.callee.name === 'ReplaceVariables') {
        return (
          argument.arguments?.[0]?.type !== 'CallExpression' && argument.arguments?.[0]?.callee?.name !== 'Translate'
        );
      }
      return argument.callee.name !== 'Translate';
    }

    return {
      /**
       * @param {import("@typescript-eslint/utils").TSESTree.ExpressionStatement} node
       * @returns void
       */
      ExpressionStatement(node) {
        if (node?.expression?.type !== 'CallExpression') return;
        const expression = node.expression;
        if (expression?.callee?.type !== 'MemberExpression') return;
        if (
          expression?.callee?.object?.type === 'NewExpression' &&
          expression?.callee?.object?.callee?.type === 'Identifier' &&
          expression?.callee?.object?.callee?.name === 'Embed' &&
          expression?.callee?.object?.parent?.type === 'MemberExpression' &&
          expression?.callee?.object?.parent?.property?.type === 'Identifier' &&
          ['setTitle', 'setDescription'].includes(expression.callee.object.parent.property.name)
        ) {
          if (checkArgument(expression.arguments[0])) context.report({ node, messageId: 'missingTranslate' });
        }
        if (
          expression?.callee?.object?.name === 'console' &&
          ['log', 'error'].includes(expression?.callee?.property?.name) === false
        ) {
          if (checkArgument(expression.arguments[0])) context.report({ node, messageId: 'missingTranslate' });
        }
      }
    };
  }
});
