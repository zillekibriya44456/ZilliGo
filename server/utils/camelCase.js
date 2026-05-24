/**
 * Utility to convert snake_case keys in an object to camelCase
 */
const toCamel = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map(v => toCamel(v));
  } else if (obj !== null && obj.constructor === Object) {
    return Object.keys(obj).reduce(
      (result, key) => ({
        ...result,
        [key.replace(/(_\w)/g, (m) => m[1].toUpperCase())]: toCamel(obj[key]),
      }),
      {}
    );
  }
  return obj;
};

module.exports = { toCamel };
