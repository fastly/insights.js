/* eslint-disable indent */
import templateResource from "./templateResource";
import { mockRandomForEach } from "jest-mock-random";
import configFixture from "../fixtures/config";

describe("templateResource", (): void => {
  mockRandomForEach(
    Array(16)
      .fill(0.01)
      .map((v, i): number => v * i)
  );
  it.each`
    input                                                                       | expected
    ${""}                                                                       | ${""}
    ${"https://www.fastly-insights.com/o.svg"}                                  | ${"https://www.fastly-insights.com/o.svg"}
    ${"https://www.fastly insights.com/o.svg"}                                  | ${"https://www.fastlyinsights.com/o.svg"}
    ${"https://www.fastly-insights.com/o.svg?id=<% TEST_ID %>"}                 | ${"https://www.fastly-insights.com/o.svg?id=42c91a26-c33f-482a-9ac9-353cd615c0a9"}
    ${"https://www.fastly-insights.com/o.svg?id=<%TEST_ID%>"}                   | ${"https://www.fastly-insights.com/o.svg?id=42c91a26-c33f-482a-9ac9-353cd615c0a9"}
    ${"https://www.fastly-insights.com/o.svg?id=<%test_Id%>"}                   | ${"https://www.fastly-insights.com/o.svg?id=42c91a26-c33f-482a-9ac9-353cd615c0a9"}
    ${"https://<%TEST_ID%>.fastly-insights.com/o.svg?id=<%TEST_ID%>"}           | ${"https://42c91a26-c33f-482a-9ac9-353cd615c0a9.fastly-insights.com/o.svg?id=42c91a26-c33f-482a-9ac9-353cd615c0a9"}
    ${"https://www.fastly-insights.com/o.svg?rand=<%RANDOM%>"}                  | ${"https://www.fastly-insights.com/o.svg?rand=AABBCDDEEFGGHIIJ"}
    ${"https://www.fastly-insights.com/o.svg?id=<% TEST_ID %>&rand=<%RANDOM%>"} | ${"https://www.fastly-insights.com/o.svg?id=42c91a26-c33f-482a-9ac9-353cd615c0a9&rand=AABBCDDEEFGGHIIJ"}
  `(
    'Should template the input string "$input" correctly',
    ({ input, expected }): void => {
      expect(templateResource(input, configFixture)).toBe(expected);
    }
  );
});
