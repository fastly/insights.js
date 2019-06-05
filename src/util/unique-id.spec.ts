import { generateId, randomHex } from "./unique-id";

const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

describe("Unique ID", (): void => {
  it("should generate a v4 UUID", (): void => {
    expect(generateId()).toEqual(expect.stringMatching(uuidRegex));
  });

  it("should be unique between invocations", (): void => {
    expect(generateId()).not.toEqual(generateId());
  });

  it("randomHex should generate a string from 0-f when passing 0 or 1", (): void => {
    expect(randomHex("0")).toEqual(expect.stringMatching(/[0-9a-f]/));
    expect(randomHex("1")).toEqual(expect.stringMatching(/[0-9a-f]/));
  });

  it("randomHex should generate a string from 8-b when passing in '8'", (): void => {
    expect(randomHex("8")).toEqual(expect.stringMatching(/[89ab]/));
  });
});
