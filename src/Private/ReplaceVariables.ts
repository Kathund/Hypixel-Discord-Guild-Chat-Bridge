export default function ReplaceVariables(template: string, variables: object): string {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  return template.replace(/\{(\w+)\}/g, (match, name) => variables[name] ?? match);
}
