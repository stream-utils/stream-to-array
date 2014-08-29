# Stream to Array

[![NPM version][npm-image]][npm-url]
[![Build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![Dependency Status][david-image]][david-url]
[![License][license-image]][license-url]
[![Downloads][downloads-image]][downloads-url]
[![Gittip][gittip-image]][gittip-url]

Concatenate a readable stream's data into a single array.

You may also be interested in:

- [raw-body](https://github.com/stream-utils/raw-body) for strings

## API

```js
var toArray = require('stream-to-array')
```

### toArray([stream], [callback(err, arr)])

Returns all the data objects in an array.
This is useful for streams in object mode if you want to just use an array.

```js
var stream = new Stream.Readable()
toArray(stream, function (err, arr) {
  assert.ok(Array.isArray(arr))
})
```

If `stream` is not defined, it is assumed that `this` is a stream.

```js
var stream = new Stream.Readable()
stream.toArray = toArray
stream.toArray(function (err, arr) {

})
```

If `callback` is not defined, then it is assumed that it is being yielded within a generator.

```js
function* () {
  var stream = new Stream.Readable()
  stream.toArray = toArray
  var arr = yield stream.toArray()
}
```

If you want to return a buffer, just use `Buffer.concat(arr)`

```js
var stream = new Stream.Readable()
var arr = yield toArray(stream)
var buffer = Buffer.concat(arr)
```

[npm-image]: https://img.shields.io/npm/v/stream-to-array.svg?style=flat-square
[npm-url]: https://npmjs.org/package/stream-to-array
[github-tag]: http://img.shields.io/github/tag/stream-utils/stream-to-array.svg?style=flat-square
[github-url]: https://github.com/stream-utils/stream-to-array/tags
[travis-image]: https://img.shields.io/travis/stream-utils/stream-to-array.svg?style=flat-square
[travis-url]: https://travis-ci.org/stream-utils/stream-to-array
[coveralls-image]: https://img.shields.io/coveralls/stream-utils/stream-to-array.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/stream-utils/stream-to-array?branch=master
[david-image]: http://img.shields.io/david/stream-utils/stream-to-array.svg?style=flat-square
[david-url]: https://david-dm.org/stream-utils/stream-to-array
[license-image]: http://img.shields.io/npm/l/stream-to-array.svg?style=flat-square
[license-url]: LICENSE
[downloads-image]: http://img.shields.io/npm/dm/stream-to-array.svg?style=flat-square
[downloads-url]: https://npmjs.org/package/stream-to-array
[gittip-image]: https://img.shields.io/gittip/jonathanong.svg?style=flat-square
[gittip-url]: https://www.gittip.com/jonathanong/
