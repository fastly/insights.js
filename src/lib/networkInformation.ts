// networkInformation gets the Network Intoformation API interface via the
// navigator.connection gloabl and clones the object as it is read only.
export default function networkInformation(): NetworkInformation {
  const connection = navigator && navigator.connection;
  if (connection) {
    const res: NetworkInformation = {};
    /* eslint-disable guard-for-in */
    for (const prop in connection) {
      const type = typeof connection[prop];
      if (type === "number" || type === "string" || type === "boolean") {
        res[prop] = connection[prop];
      }
    }
    return res;
  }
  return {};
}
