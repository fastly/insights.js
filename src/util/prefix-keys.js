const prefixKeys = (obj, prefix) => {
  return Object.keys(obj).reduce((clone, key) => {
    clone[prefix + key] = obj[key];
    return clone;
  }, {});
};

export default prefixKeys;
