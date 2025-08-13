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
        if (node.superClass === undefined || node.superClass === null) return;
        if (node.superClass.type === undefined || node.superClass.type !== 'Identifier') return;
        if (node.superClass.name === undefined || node.superClass.name !== 'ConfigInstance') return;
        if (node.body === undefined || node.body.type !== 'ClassBody') return;
        if (node.body.body === undefined || node.body.body.length !== 1) return;
        if (node.body.body[0] === undefined || node.body.body[0].type !== 'MethodDefinition') return;

        const valueBody = node.body.body[0].value;
        if (valueBody === undefined || valueBody.type !== 'FunctionExpression') return;
        if (valueBody.body === undefined || valueBody.body.type !== 'BlockStatement') return;
        if (valueBody.body === undefined || valueBody.body.length <= 1) return;
        if (valueBody.body.body[0] === undefined || valueBody.body.body[0].type !== 'ExpressionStatement') return;

        const expression = valueBody.body.body[0].expression;
        if (expression === undefined || expression.type !== 'CallExpression') return;
        if (expression.callee === undefined || expression.callee.type !== 'Super') return;
        if (expression.arguments === undefined || expression.arguments.length <= 1) return;
        if (expression.arguments[0] === undefined || expression.arguments[0].type !== 'Literal') return;
        if (expression.arguments[0].value === undefined) return;
        if (/^[a-z]+$/.test(expression.arguments[0].value) !== false) return;

        context.report({ node, messageId: 'invalidName' });
      }
    };
  }
});
