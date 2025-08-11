/* eslint-disable import/prefer-default-export */
export function sortJSON(data: Record<string, any>): Record<string, any> {
  return Object.keys(data)
    .sort()
    .reduce(
      (acc, key) => {
        acc[key] = data[key];
        return acc;
      },
      {} as Record<string, any>
    );
}
