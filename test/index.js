
var assert = require('assert')
var stream = require('stream')
var path = require('path')
var fs = require('fs')
var trycatch = require("trycatch")

var toArray = require('..')

var file = path.join(__dirname, 'index.js')

function emptyStream() {
  var s = new stream()
  process.nextTick(function () {
    s.emit('end')
  })
  return s
}

function closedStream() {
  var s = new stream.Readable();
  s._read = function () {
  }
  process.nextTick(function () {
    s.emit('close')
  })
  return s
}

describe('Stream To Array', function () {
  describe('as a function', function () {
    it('should work', function (done) {
      toArray(fs.createReadStream(file), function (err, arr) {
        if (err)
          return done(err)

        assert.ok(Array.isArray(arr))
        assert.ok(arr.length)

        done()
      })
    })

    it('should work as a promise', function () {
      return toArray(fs.createReadStream(file)).then(function (arr) {
        assert.ok(Array.isArray(arr))
        assert.ok(arr.length)
      })
    })

    it('should work as a promise with zalgo', function () {
      return toArray(emptyStream()).then(function (arr) {
        assert.ok(Array.isArray(arr))
        assert.equal(arr.length, 0)
      })
    })

    it('should work as a promise with chucky', function () {
      return toArray(closedStream()).then(function (arr) {
        assert.ok(Array.isArray(arr))
        assert.equal(arr.length, 0)
      })
    })

    it('should not swallow errors', function (done) {
      var id = {}
      trycatch(
        function () {
          toArray(emptyStream(), function (err, arr) {
            if (err)
              return done(err)

            var err = new Error("foo")
            err.id = id
            throw err
          })
        },
        function (err) {
          assert(err);
          assert.equal(err.id, id);
          done();
        }
      )
    })
  })

  describe('as a method', function () {
    it('should work', function (done) {
      var stream = fs.createReadStream(file)
      stream.toArray = toArray
      stream.toArray(function (err, arr) {
        if (err)
          return done(err)

        assert.ok(Array.isArray(arr))
        assert.ok(arr.length)

        done()
      })
    })

    it('should work as a promise', function () {
      var stream = fs.createReadStream(file)
      stream.toArray = toArray
      return stream.toArray().then(function (arr) {
        assert.ok(Array.isArray(arr))
        assert.ok(arr.length)
      })
    })

    it('should work as a promise with zalgo', function () {
      var stream = emptyStream()
      stream.toArray = toArray
      return stream.toArray().then(function (arr) {
        assert.ok(Array.isArray(arr))
        assert.equal(arr.length, 0)
      })
    })

    it('should work as a promise with chucky', function () {
      var stream = closedStream()
      stream.toArray = toArray
      return stream.toArray().then(function (arr) {
        assert.ok(Array.isArray(arr))
        assert.equal(arr.length, 0)
      })
    })
  })
})
