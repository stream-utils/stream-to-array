exports.array = toArray
exports.buffer = toBuffer

function toArray(stream, done) {
  var arr = []

  stream.on('data', onData)
  stream.once('end', onEnd)
  stream.once('error', onEnd)
  stream.once('close', cleanup)

  return function (fn) {
    done = fn
  }

  function onData(doc) {
    arr.push(doc)
  }

  function onEnd(err) {
    done(err, arr)
    cleanup()
  }

  function cleanup() {
    arr = null
    stream.removeListener('data', onData)
    stream.removeListener('end', onEnd)
    stream.removeListener('error', onEnd)
    stream.removeListener('close', cleanup)
  }
}

function toBuffer(stream, done) {
  toArray(stream, function (err, arr) {
    done(err, arr && Buffer.concat(arr))
  })

  return function (fn) {
    done = fn
  }
}