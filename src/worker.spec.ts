import { describe, it } from "mocha";
import { expect } from "chai";

import * as worker from "./worker";

describe("worker", (): void => {
  it("should expose an init method", (): void => {
    expect(worker).to.have.property("init");
  });
});
