var assert = require('assert')
var path = require('path')
var fs = require('fs')

var streamTo = require('./')

var file = path.join(__dirname, 'index.js')

describe('Stream To', function () {
  describe('Array', function () {
    it('should work', function (done) {
      streamTo.array(fs.createReadStream(file), function (err, arr) {
        if (err)
          return done(err)

        assert.ok(Array.isArray(arr))
        assert.ok(arr.length)

        done()
      })
    })
  })

  describe('Buffer', function () {
    it('should work', function (done) {
      streamTo.buffer(fs.createReadStream(file), function (err, buffer) {
        if (err)
          return done(err)

        assert.ok(Buffer.isBuffer(buffer))
        assert.ok(buffer.length)

        done()
      })
    })
  })

  describe('String', function () {
    it('should work with a binary stream and set encoding', function (done) {
      var stream = fs.createReadStream(file)
      stream.setEncoding('utf8')

      streamTo.string(stream, function (err, string) {
        if (err)
          return done(err)

        assert.ok(typeof string === 'string')
        assert.ok(string.length)

        done()
      })
    })

    it('should work with a string stream', function (done) {
      streamTo.string(fs.createReadStream(file, 'utf8'), function (err, string) {
        if (err)
          return done(err)

        assert.ok(typeof string === 'string')
        assert.ok(string.length)

        done()
      })
    })
  })
})