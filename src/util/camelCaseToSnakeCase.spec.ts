/* eslint-disable indent */
import camelCaseToSnakeCase from "./camelCaseToSnakeCase";

describe("camelCaseToSnakeCase", (): void => {
  it.each`
    a                 | expected
    ${"fooBar"}       | ${"foo_bar"}
    ${"fooBarBaz"}    | ${"foo_bar_baz"}
    ${"fooBar123Baz"} | ${"foo_bar123_baz"}
    ${"foobar"}       | ${"foobar"}
    ${"_foobar"}      | ${"foobar"}
  `("should return $expected when given $a", ({ a, expected }): void => {
    expect(camelCaseToSnakeCase(a)).toEqual(expected);
  });
});
