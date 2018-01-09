import * as lib from "../../../src/tasks/pop/configure-tasks";
import neighbours from "../../fixtures/neighbours";

const fixture = {
  pops: neighbours,
  hosts: {
    pop: "pops.test.com"
  }
};

describe("Configure POP tasks", () => {
  describe("#popToTask", () => {
    it("should be a function", () => {
      expect(lib.popToTask).to.be.an("function");
    });

    it("should return a function", () => {
      expect(lib.popToTask("www.test.com")).to.be.a("function");
    });

    it("applied function should return a POP task model", () => {
      const func = lib.popToTask("www.test.com");
      const result = func("LHR");
      expect(result).to.be.an("object");
      expect(result).to.have.property("id");
      expect(result).to.have.property("type");
      expect(result).to.have.property("host");
    });
  });

  describe("#transform", () => {
    function containsPop(arr, pop) {
      return arr.some(p => p.id === pop);
    }

    it("should be a function", () => {
      expect(lib.transform).to.be.an("function");
    });

    it("should return an array", () => {
      expect(lib.transform(fixture)).to.be.an("array");
    });

    it("should model tasks for a defined number of required POPS", () => {
      const neighboursFixture = ["LHR", "LCY", "AMS", "CDG", "FRA"];
      const othersFixture = ["HHN", "MAD"];
      const allFixture = neighboursFixture.concat(othersFixture);
      const result = lib.transform(
        Object.assign({}, fixture, { pops: allFixture }),
        5,
        0
      );

      neighboursFixture.forEach(p => {
        expect(containsPop(result, p)).to.be.true;
      });

      othersFixture.forEach(p => {
        expect(containsPop(result, p)).to.be.false;
      });
    });

    it("should model tasks for definded number of randomly selected POPs", () => {
      const neighbourCount = 4;
      const randomCount = 2;
      const exclusionFxiture = ["LHR", "LCY", "AMS", "CDG", "FRA"];
      const result = lib.transform(fixture, neighbourCount, randomCount);
      const others = result.filter(p => exclusionFxiture.indexOf(p.id) < 0);

      expect(others).to.have.length(randomCount);
    });
  });
});
