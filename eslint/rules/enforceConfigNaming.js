import { ESLintUtils } from '@typescript-eslint/utils';

const createRule = ESLintUtils.RuleCreator((name) => name);
const defaultOptions = [{ always: true }];
const regex = /^[a-z](?:[a-z_]*[a-z])?$/;

export default createRule({
  name: 'eslint-enforce-config-naming',
  defaultOptions,
  meta: {
    docs: { description: 'enforce the config naming schema' },
    messages: {
      invalidName: 'Invalid config name. Please only use a-z and _ when naming things, no ending with _',
      invalidKey: 'Invalid config key name. Please only use a-z and _ when naming things, no ending with _'
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
        if (!valueBody.body) return;
        if (valueBody.type !== 'FunctionExpression' || valueBody.body.type !== 'BlockStatement') return;
        if (valueBody.body.length <= 1) return;
        valueBody.body.body.forEach((body) => {
          if (body.type !== 'ExpressionStatement' || body.expression?.type !== 'CallExpression') return;
          if (!body.expression.callee?.type) return;
          if (!body.expression.arguments || body.expression.arguments.length <= 1) return;
          if (body.expression.arguments[0]?.type !== 'Literal' || !body.expression.arguments[0].value) return;
          switch (body.expression.callee.type) {
            case 'Super': {
              if (regex.test(body.expression.arguments[0].value)) return;
              context.report({ node, messageId: 'invalidName' });
              break;
            }
            case 'MemberExpression': {
              if (regex.test(body.expression.arguments[0].value)) return;
              context.report({ node, messageId: 'invalidKey' });
              break;
            }
            default: {
              break;
            }
          }
        });
      }
    };
  }
});
