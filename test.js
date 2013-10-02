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
})