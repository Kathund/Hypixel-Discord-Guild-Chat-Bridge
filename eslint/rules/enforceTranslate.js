import { ESLintUtils } from '@typescript-eslint/utils';

const createRule = ESLintUtils.RuleCreator((name) => name);
const defaultOptions = [{ always: true }];

export default createRule({
  name: 'eslint-enforce-translate',
  defaultOptions,
  meta: {
    docs: { description: 'enforce using the Translate function' },
    messages: {
      missingTranslate: 'Use the translate function when parsing in strings for the end user',
      badTranslateKey: 'Translation keys only support A-z, _ and .'
    },
    schema: [],
    type: 'problem'
  },

  create(context) {
    /**
     * @param {import("@typescript-eslint/utils").TSESTree.CallExpression} argument
     * @returns boolean
     */
    function checkInput(argument) {
      const regex = /^[A-z](?:[A-z_.]*[A-z])?$/;
      if (argument.type === 'CallExpression') return checkInput(argument.arguments[0]);
      return !regex.test(argument.value);
    }

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
     * @param {import("@typescript-eslint/utils").TSESTree.CallExpression} expression
     * @returns booleanj
     */
    function checkForEmbed(expression) {
      if (
        expression?.callee?.object?.callee?.object?.callee?.object?.callee?.type === 'Identifier' &&
        expression?.callee?.object?.callee?.object?.callee?.object?.callee?.name === 'Embed'
      ) {
        return true;
      }

      if (
        expression?.callee?.object?.callee?.object?.callee?.type === 'Identifier' &&
        expression?.callee?.object?.callee?.object?.callee?.name === 'Embed'
      ) {
        return true;
      }

      if (
        expression?.callee?.object?.callee?.type === 'Identifier' &&
        expression?.callee?.object?.callee?.name === 'Embed'
      ) {
        return true;
      }

      return false;
    }

    /**
     * @param {import("@typescript-eslint/utils").TSESTree.CallExpression} expression
     * @param {import("@typescript-eslint/utils").TSESTree.ReturnStatement | import("@typescript-eslint/utils").TSESTree.ExpressionStatement | import("@typescript-eslint/utils").TSESTree.VariableDeclaration} node
     * @returns void
     */
    function checkEmbed(expression, node) {
      // expression?.callee?.object?.callee?.object?.callee?.object?.callee.name
      const embedChecks = ['setTitle', 'setDescription'];
      if (
        expression?.callee?.object?.type === 'CallExpression' &&
        checkForEmbed(expression) &&
        expression?.callee?.object?.callee?.property?.type === 'Identifier' &&
        embedChecks.includes(expression?.callee?.object?.callee?.property?.name)
      ) {
        if (checkArgument(expression.callee.object.arguments[0])) {
          context.report({ node, messageId: 'missingTranslate' });
        } else if (checkInput(expression.callee.object.arguments[0].arguments[0])) {
          context.report({ node, messageId: 'badTranslateKey' });
        }
      }
      if (
        expression?.callee?.object?.type === 'CallExpression' &&
        checkForEmbed(expression) &&
        expression?.callee?.property?.type === 'Identifier' &&
        embedChecks.includes(expression?.callee?.property?.name)
      ) {
        if (checkArgument(expression.arguments[0])) {
          context.report({ node, messageId: 'missingTranslate' });
        } else if (checkInput(expression.arguments[0].arguments[0])) {
          context.report({ node, messageId: 'badTranslateKey' });
        }
      }
      if (
        expression?.callee?.object?.type === 'NewExpression' &&
        checkForEmbed(expression) &&
        expression?.callee?.object?.parent?.property?.type === 'Identifier' &&
        embedChecks.includes(expression.callee.object.parent.property.name)
      ) {
        if (checkArgument(expression.arguments[0])) {
          context.report({ node, messageId: 'missingTranslate' });
        } else if (checkInput(expression.arguments[0].arguments[0])) {
          context.report({ node, messageId: 'badTranslateKey' });
        }
      }
    }

    /**
     * @param {import("@typescript-eslint/utils").TSESTree.CallExpression} argument
     * @param {import("@typescript-eslint/utils").TSESTree.ReturnStatement | import("@typescript-eslint/utils").TSESTree.ExpressionStatement} node
     * @returns void
     */
    function checkExpression(expression, node) {
      if (expression?.callee?.type !== 'MemberExpression') return;
      checkEmbed(expression, node);
      if (
        expression?.callee?.object?.name === 'console' &&
        ['log', 'error'].includes(expression?.callee?.property?.name) === false
      ) {
        if (checkArgument(expression.arguments[0])) {
          context.report({ node, messageId: 'missingTranslate' });
        } else if (checkInput(expression.arguments[0].arguments[0])) {
          context.report({ node, messageId: 'badTranslateKey' });
        }
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
              if (checkArgument(property.value)) {
                context.report({ node, messageId: 'missingTranslate' });
              } else if (checkInput(property.value.arguments[0])) {
                context.report({ node, messageId: 'badTranslateKey' });
              }
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
      },
      /**
       * @param {import("@typescript-eslint/utils").TSESTree.VariableDeclaration} node
       * @returns void
       */
      VariableDeclaration(node) {
        node.declarations.forEach((declation) => {
          if (declation.type !== 'VariableDeclarator') return;
          checkExpression(declation.init, node);
        });
      }
    };
  }
});
