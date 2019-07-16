//eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
import * as PerformanceObserver from "@fastly/performance-observer-polyfill";

declare module "@fastly/performance-observer-polyfill" {
  export const mockGetEntriesByName: jest.Mock;
  export const mockDisconnect: jest.Mock;
  export const mockObserve: jest.Mock;
  export const mockPerformanceObserver: jest.Mock;
}
