exports.array = toArray
exports.buffer = toBuffer
exports.string = toString

function toArray(stream, callback) {
  var arr = []

  stream.on('data', onData)
  stream.once('error', callback)
  stream.once('error', cleanup)
  stream.once('end', onEnd)
  stream.once('end', cleanup)
  stream.once('close', callback)
  stream.once('close', cleanup)

  function onData(doc) {
    arr.push(doc)
  }

  function onEnd() {
    callback(null, arr)
  }

  function cleanup() {
    arr = null
    stream.removeListener('data', onData)
    stream.removeListener('error', callback)
    stream.removeListener('error', cleanup)
    stream.removeListener('end', onEnd)
    stream.removeListener('end', cleanup)
    stream.removeListener('close', callback)
    stream.removeListener('close', cleanup)
  }

  return stream
}

function toBuffer(stream, callback) {
  toArray(stream, function (err, arr) {
    if (err || !arr)
      callback()
    else
      callback(null, Buffer.concat(arr))
  })

  return stream
}

function toString(stream, callback) {
  toArray(stream, function (err, arr) {
    if (err || !arr)
      callback()
    else
      callback(null, arr.join(''))
  })

  return stream
}