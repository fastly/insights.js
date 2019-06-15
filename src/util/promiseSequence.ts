export default function sequence<T>(funcs: (() => Promise<T>)[]): Promise<T[]> {
  return funcs.reduce((prom: Promise<T[]>, func: () => Promise<T>): Promise<
    T[]
  > => {
    return prom.then(
      (results: T[]): Promise<T[]> =>
        func().then((result: T): T[] => [...results, result])
    );
  }, Promise.resolve([]));
}
