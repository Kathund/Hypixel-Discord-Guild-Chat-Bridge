/* eslint-disable import/prefer-default-export */
export function sortJSON(data: Record<string, any>): Record<string, any> {
  return Object.keys(data)
    .sort()
    .reduce(
      (acc, key) => {
        const value = data[key];
        acc[key] = value && typeof value === 'object' && !Array.isArray(value) ? sortJSON(value) : value;
        if (Array.isArray(value)) {
          let stringArray = true;
          let numberArray = true;
          let objectArray = true;
          for (const item of value) {
            if (stringArray === false) continue;
            if (typeof item !== 'string') stringArray = false;
          }
          for (const item of value) {
            if (numberArray === false) continue;
            if (typeof item !== 'number') numberArray = false;
          }
          for (const item of value) {
            if (objectArray === false) continue;
            if (typeof item !== 'object' || Array.isArray(item)) objectArray = false;
          }
          if (stringArray || numberArray) acc[key] = value.sort();
          if (objectArray) {
            acc[key] = [];
            for (const item of value) {
              acc[key].push(sortJSON(item));
            }
          }
        }
        return acc;
      },
      {} as Record<string, any>
    );
}
