import { ESLintUtils } from '@typescript-eslint/utils';

const createRule = ESLintUtils.RuleCreator((name) => name);
const defaultOptions = [{ always: true }];

export default createRule({
  name: 'eslint-enforce-config-naming',
  defaultOptions,
  meta: {
    docs: { description: 'enforce the config naming schema' },
    messages: {
      invalidName: 'Invalid config name. Please only use a-z when naming configs'
    },
    schema: [],
    type: 'problem'
  },

  create(context) {
    return {
      /**
       * @param {import("@typescript-eslint/utils").TSESTree.ClassDeclaration} node
       * @returns void
       */
      ClassDeclaration(node) {
        if (!node.superClass || node.superClass.type !== 'Identifier' || node.superClass.name !== 'ConfigInstance') {
          return;
        }
        if (!node.body || node.body.type !== 'ClassBody') return;
        if (!node.body.body || node.body.body.length !== 1) return;
        if (node.body.body[0].type !== 'MethodDefinition') return;

        const valueBody = node.body.body[0].value;
        if (!valueBody.body || valueBody.type !== 'FunctionExpression' || valueBody.body.type !== 'BlockStatement') {
          return;
        }
        if (valueBody.body.length <= 1) return;
        if (valueBody.body.body[0].type !== 'ExpressionStatement') return;

        const expression = valueBody.body.body[0].expression;
        if (expression?.type !== 'CallExpression' || expression.callee?.type !== 'Super') return;
        if (!expression.arguments || expression.arguments.length <= 1) return;
        if (expression.arguments[0]?.type !== 'Literal' || !expression.arguments[0].value) return;
        if (/^[a-z]+$/.test(expression.arguments[0].value)) return;

        context.report({ node, messageId: 'invalidName' });
      }
    };
  }
});
