export default function sequence(tasks) {
  return tasks.reduce((prom, task) => {
    return prom.then(results => task().then(result => [...results, result]));
  }, Promise.resolve([]));
}
