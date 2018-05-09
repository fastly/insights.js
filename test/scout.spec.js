function load() {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `/base/dist/scout.js`;
    script.setAttribute("id", "fastlyjs");
    script.onload = () => resolve();
    script.onerror = () => reject();
    document.body.appendChild(script);
  });
}

describe("Scout", () => {
  let _insertBefore;
  let lib;

  beforeEach(() => {
    _insertBefore = document.body.insertBefore;
    const insertBeforeHandler = s => (lib = s);
    document.body.insertBefore = chai.spy(insertBeforeHandler);
  });

  afterEach(() => {
    lib = null;
    document.body.insertBefore = _insertBefore;
    const script = document.getElementById("fastlyjs");
    document.body.removeChild(script);
  });

  it("exports a global FASTLY object on the window", () =>
    load().then(() => {
      expect(window.FASTLY).to.exist;
      expect(window.FASTLY).to.be.an("object");
    }));

  it("returns a config object", () =>
    load().then(() => {
      expect(window.FASTLY.config).to.be.an("object");
    }));

  it("should test UA for feature capabilites", () =>
    load().then(() => {
      expect(window.FASTLY.ctm).to.exist;
      expect(window.FASTLY.ctm).to.be.an("boolean");
      expect(window.FASTLY.ctm).to.be.true;
    }));

  it("should inject script to library into DOM", done => {
    load().then(() => {
      // Forcing assertion to be async due to setTimeout in the script
      setTimeout(() => {
        expect(document.body.insertBefore).to.have.been.called();
        done();
      }, 0);
    });
  });

  it("should invoke the library init method if it exists", done => {
    load().then(() => {
      // Forcing assertion to be async due to setTimeout in the script
      setTimeout(() => {
        window.FASTLY.init = chai.spy();
        lib.onload();
        expect(window.FASTLY.init).to.have.been.called();
        done();
      }, 0);
    });
  });

  describe("ctm", () => {
    let _getEntries;

    before(() => {
      _getEntries = window.performance.getEntries;
      window.performance.getEntries = undefined;
    });

    after(() => {
      window.performance.getEntries = _getEntries;
    });

    it(`should not inject script if UA doesn't cut the mustard`, () =>
      load().then(() => {
        expect(document.body.insertBefore).to["not"].have.been.called();
      }));
  });

  describe("sampling", () => {
    before(() => {
      window.FASTLY = { config: { settings: { sample: 0 } } };
    });

    it("should not inject script if below sample rate", () =>
      load().then(() => {
        expect(document.body.insertBefore).to["not"].have.been.called();
      }));
  });

  describe("delayed load", () => {
    before(() => {
      window.FASTLY = { config: { settings: { sample: 1, delay: 1 } } };
      chai.spy.on(window, "setTimeout");
    });

    afterEach(() => {
      window.setTimeout.reset();
    });

    it("should delay initialisation by the configured delay period", () =>
      load().then(() => {
        expect(window.setTimeout).to.have.been.called.once;
        expect(window.setTimeout).to.have.been.called.with(1);
      }));
  });
});
