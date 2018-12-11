# pino-profile
A profiler extension of the pino logger similar to https://github.com/winstonjs/winston#profiling

## Installation
```
npm install --save pino-profile
```

## Interface
```js
const Profiler = require('pino-profile');
const profiler = new Profiler(logger); // instantiate with a pino logger
profiler.start('key1');
...doStuff
profiler.stop('key1'); // Will log at info level { key: key1, elapsed_ms: <the amount of time since start was called> }
```

It also supports timing functions and promises:
```js
/** lib.js */
const slowFunction(arg1, arg2) {
  ...
}

const asyncFunction(arg1, arg2) {
  return new Promise((resolve) => {
    doSomethingAsync(arg1, arg2, res => {
      resolve(res);
    });
  });
}

module.exports = {
  slowFn: profiler.time('slowFunction', slowFunction),
  asyncFn: profiler.time('asyncFunction', asyncFunction),
}

/** index.js */
const { slowFn, asyncFn } = require('./lib');

// will log the time the function took in ms
const res = slowFn(arg1, arg2); .

// Here we'll log the amount of time it took for the promise to resolve
// as opposed to the trivial amount of time it took for the function to complete
asyncFn(arg1, arg2).then(r => {
  doSomethingWith(r);
});
```
