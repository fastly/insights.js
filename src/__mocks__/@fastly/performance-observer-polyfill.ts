import entriesFixture from "../../fixtures/entries";

export const mockGetEntriesByName = jest.fn(
  (): ResourceTimingEntry[] => [
    (entriesFixture[0] as any) as ResourceTimingEntry
  ]
);
export const mockDisconnect = jest.fn();
export const mockObserve = jest.fn();
export const mockTakeRecords = jest.fn();

export const mockPerformanceObserver = jest.fn().mockImplementation(
  (callback): PerformanceObserver => {
    const observer = {
      observe: mockObserve,
      disconnect: mockDisconnect,
      takeRecords: mockTakeRecords
    };
    callback(
      {
        getEntriesByName: mockGetEntriesByName
      },
      observer
    );

    return observer;
  }
);

export default mockPerformanceObserver;
