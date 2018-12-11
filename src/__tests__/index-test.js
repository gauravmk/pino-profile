const Profiler = require("..");

// Within 10ms of 10ms
const around10 = { asymmetricMatch: actual => actual > 10 && actual < 20 };

describe("Profiler", () => {
  it("profiles code", done => {
    const logger = { info: jest.fn() };
    p = new Profiler(logger);
    p.start("test");
    setTimeout(() => {
      p.stop("test");

      expect(logger.info).toHaveBeenCalledWith({
        key: "test",
        elapsed_ms: around10
      });

      done();
    }, 10);
  });

  it("times functions", () => {
    const fn = () => {
      for (let i = 0; i < 10000000; i++);
      return "resp";
    };

    const logger = { info: jest.fn() };
    const p = new Profiler(logger);
    const timedFn = p.time("fn", fn);

    expect(timedFn()).toEqual("resp");
    expect(logger.info).toHaveBeenCalledWith({
      key: "fn",
      elapsed_ms: {
        asymmetricMatch: actual => actual > 1
      }
    });
  });

  it("times promises", done => {
    const promise = new Promise(resolve => {
      setTimeout(() => resolve("promise_resolve"), 10);
    });

    const logger = { info: jest.fn() };
    const p = new Profiler(logger);
    const timedPromise = p.time("promise", promise);

    timedPromise.then(val => {
      expect(val).toEqual("promise_resolve");
      expect(logger.info).toHaveBeenCalledWith({
        key: "promise",
        elapsed_ms: around10
      });
      done();
    });
  });

  it("times function that returns a promise", done => {
    const asyncFn = input => {
      return new Promise(resolve => {
        setTimeout(() => resolve(input), 10);
      });
    };

    const logger = { info: jest.fn() };
    const p = new Profiler(logger);
    const timedFn = p.time("asyncfn", asyncFn);

    timedFn("inputVal").then(resp => {
      expect(resp).toEqual("inputVal");
      expect(logger.info).toHaveBeenCalledWith({
        key: "asyncfn",
        elapsed_ms: around10
      });
      done();
    });
  });
});
