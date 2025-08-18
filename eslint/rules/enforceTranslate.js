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

    /**
     * @param {import("@typescript-eslint/utils").TSESTree.CallExpression} argument
     * @param {import("@typescript-eslint/utils").TSESTree.ReturnStatement | import("@typescript-eslint/utils").TSESTree.ExpressionStatement} node
     * @returns void
     */
    function checkExpression(expression, node) {
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
      if (
        (expression?.callee?.object?.type === 'Identifier' && expression?.callee?.object?.name === 'res') ||
        (expression?.callee?.object?.type === 'CallExpression' &&
          expression?.callee?.object?.callee?.object?.type === 'Identifier' &&
          expression?.callee?.object?.callee?.object?.name === 'res')
      ) {
        if (expression?.callee?.property?.name !== 'send') return;
        if (
          expression?.arguments?.[0]?.type === 'ObjectExpression' &&
          expression?.arguments?.[0]?.properties.length >= 1
        ) {
          expression.arguments[0].properties
            .filter(
              (property) =>
                property?.type === 'Property' &&
                property?.key?.type === 'Identifier' &&
                property?.key?.name === 'message'
            )
            .forEach((property) => {
              if (property.value.type === 'Literal' && property.value.value === null) return;
              if (checkArgument(property.value)) context.report({ node, messageId: 'missingTranslate' });
            });
        }
      }
    }

    return {
      /**
       * @param {import("@typescript-eslint/utils").TSESTree.ReturnStatement} node
       * @returns void
       */
      ReturnStatement(node) {
        if (node?.argument?.type !== 'CallExpression') return;
        checkExpression(node?.argument, node);
      },
      /**
       * @param {import("@typescript-eslint/utils").TSESTree.ExpressionStatement} node
       * @returns void
       */
      ExpressionStatement(node) {
        if (node?.expression?.type !== 'CallExpression') return;
        checkExpression(node?.expression, node);
      }
    };
  }
});
