/* eslint-disable @typescript-eslint/explicit-function-return-type */
const compose = <R>(fn1: (a: R) => R, ...fns: ((a: R) => R)[]) =>
  fns.reduce((prevFn, nextFn) => value => prevFn(nextFn(value)), fn1);

export default compose;
