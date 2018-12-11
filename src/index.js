class Profiler {
  constructor(logger, opts = {}) {
    this.logger = logger;
    this.opts = opts;
    this.profiles = {};
  }

  start(key) {
    if (this.opts.verbose && this.profiles[key]) {
      console.warn("starting a profile that was already previously started");
    }
    this.profiles[key] = process.hrtime();
    return this.profiles[key];
  }

  stop(key) {
    if (this.opts.verbose && !this.profiles[key]) {
      console.warn("stopping a profile that was never started");
    }
    if (this.profiles[key]) {
      const diff = process.hrtime(this.profiles[key]);
      const diff_in_ms = (diff[0] * 1e9 + diff[1]) / 1e6;
      this.logger.info({ key, elapsed_ms: diff_in_ms });
      delete this.profiles[key];
    }
  }

  time(key, fn_or_promise) {
    this.start(key);
    if (fn_or_promise instanceof Promise) {
      return fn_or_promise.then(res => {
        this.stop(key);
        return res;
      });
    } else {
      return (...args) => {
        const ret = fn_or_promise(...args);
        if (ret instanceof Promise) {
          return ret.then(r => {
            this.stop(key);
            return r;
          });
        } else {
          this.stop(key);
          return ret;
        }
      };
    }
  }
}

module.exports = Profiler;
