export default function sequence(tasks) {
  const results = [];

  function push(prom) {
    return prom().then(res => {
      if (res) results.push(res);
      return res;
    });
  }

  return tasks
    .reduce((current, next) => {
      return current.then(push(next));
    }, Promise.resolve())
    .then(() => results);
}
