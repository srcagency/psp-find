# Pull stream find

A pull-stream version of `Array.prototype.find` returning a promise.

```js
find(test)
```

```js
const {pull, values, map} = require('pull-stream')
const find = require('psp-find')

pull(
  values([1, 2, 3, 4]),
  find((x) => x > 2)
).then(console.log)
// 3

pull(
  values([1, 2, 3]),
  find((x) => x + 3 === 5)
).then(console.log)
// 2

pull(
  values([1, 2, 3]),
  find((x) => x > 4)
).then(console.log)
// undefined
```
