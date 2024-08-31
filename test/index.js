
var assert = require('assert')
var stream = require('stream')
var path = require('path')
var fs = require('fs')

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
      // remove all current listeners, specifically mocha's
      var listeners = process.listeners('uncaughtException')
      process.removeAllListeners('uncaughtException')

      // add our own
      process.on('uncaughtException', onUncaughtException)

      // TODO: move this testing logic to a module
      function onUncaughtException (err) {
        // remove our own listener
        process.removeListener('uncaughtException', onUncaughtException)

        // add all previous listeners
        listeners.forEach(function (listener) {
          process.on('uncaughtException', listener)
        })

        done()
      }

      toArray(emptyStream(), function () {
        // this should be uncaught
        throw new Error('BOOM')
      }).catch(function (err) {
        if (err) return done(err)
      })
    })

    it('should handle stream errors', function (done) {
      toArray(fs.createReadStream("madeupfile.jpg"))
        .then(function () {
          done(new Error("Promise should be rejected"))
        })
        .catch(function (err) {
          done()
        })
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
