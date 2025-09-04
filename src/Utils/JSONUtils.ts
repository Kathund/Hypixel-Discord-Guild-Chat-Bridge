/* eslint-disable import/prefer-default-export */
export function sortJSON(data: Record<string, any>): Record<string, any> {
  return Object.keys(data)
    .sort()
    .reduce(
      (acc, key) => {
        const value = data[key];
        acc[key] = value && typeof value === 'object' && !Array.isArray(value) ? sortJSON(value) : value;
        return acc;
      },
      {} as Record<string, any>
    );
}
