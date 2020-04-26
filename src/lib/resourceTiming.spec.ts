import {
  asyncGetEntry,
  getValidEntry,
  cloneEntry,
  removeEntryProps,
  normalizeEntry
} from "./resourceTiming";
import entriesFixture from "../fixtures/entries";
import {
  mockPerformanceObserver,
  mockGetEntriesByName,
  mockObserve,
  mockDisconnect
} from "@fastly/performance-observer-polyfill";

describe("Resource timing", (): void => {
  describe("#asyncGetEntry", (): void => {
    afterEach((): void => {
      mockGetEntriesByName.mockClear();
    });

    it("should create an instance of PerformanceObserver", (): Promise<
      void
    > => {
      const [fixture] = entriesFixture;
      return asyncGetEntry(fixture.name).then((): void => {
        expect(mockPerformanceObserver).toHaveBeenCalledTimes(1);
      });
    });

    it("should get the named entry from the observed entry list", (): Promise<
      void
    > => {
      const [fixture] = entriesFixture;
      return asyncGetEntry(fixture.name).then((result): void => {
        expect(result).toEqual(fixture);
      });
    });

    it("should call disconnect on the observer once an entry is found", (): Promise<
      void
    > => {
      const [fixture] = entriesFixture;
      return asyncGetEntry(fixture.name).then((): void => {
        expect(mockDisconnect).toHaveBeenCalledTimes(1);
      });
    });

    it("should call #observe on the observer to start oberservation", (): Promise<
      void
    > => {
      const [fixture] = entriesFixture;
      return asyncGetEntry(fixture.name).then((): void => {
        expect(mockObserve).toHaveBeenCalledTimes(1);
        const args = mockObserve.mock.calls[0][0];
        expect(typeof args).toEqual("object");
        expect(args).toHaveProperty("entryTypes");
        expect(args.entryTypes).toEqual(["resource"]);
      });
    });
  });

  describe.only("#getValidEntry", (): void => {
    it("should return a valid entry", (): void => {
      const fixture = [entriesFixture[1], entriesFixture[0]];
      expect(getValidEntry(fixture as PerformanceEntryList)).toEqual(
        fixture[1]
      );
    });

    it("should not return a invalid entry", (): void => {
      const fixture = [entriesFixture[1]];
      expect(getValidEntry(fixture as PerformanceEntryList)).toEqual(undefined);
    });
  });

  describe("#cloneEntry", (): void => {
    it("should return a clone of the entry", (): void => {
      const fixture = (entriesFixture[0] as any) as ResourceTimingEntry;
      expect(cloneEntry(fixture)).not.toEqual(fixture);
    });
  });

  describe("#removeEntryProps", (): void => {
    it("should return a new object", (): void => {
      const [fixture] = (entriesFixture as any) as ResourceTimingEntry[];
      expect(removeEntryProps(fixture, [])).not.toBe(fixture);
    });

    it("should return an without the given properties", (): void => {
      const [fixture] = (entriesFixture as any) as ResourceTimingEntry[];
      const result = removeEntryProps(fixture, ["name"]);
      expect(result).not.toHaveProperty("name");
    });
  });

  describe("#mormalizeEntry", (): void => {
    it("should remove exteraneous keys", (): void => {
      const [fixture] = (entriesFixture as any) as ResourceTimingEntry[];
      const result = normalizeEntry(fixture);
      expect(result).not.toHaveProperty("name");
      expect(result).not.toHaveProperty("entryType");
      expect(result).not.toHaveProperty("entry_type");
    });

    it("should normalize entry keys to underscore case", (): void => {
      const [fixture] = (entriesFixture as any) as ResourceTimingEntry[];
      const result = normalizeEntry(fixture);
      expect(result).not.toHaveProperty("workerStart");
      expect(result).toHaveProperty("worker_start");
    });
  });
});
