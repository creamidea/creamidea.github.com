"use strict"
////////////////////////////
// Read && Write the File //
////////////////////////////
const fs = require('fs')

module.exports = {
  read,
  stat,
  write
}

function stat(path) {
  // console.log(path)
  return new Promise((resolve, reject) => {
    fs.stat(path, (err, fd) => {
      if (err) resolve(err)
      else resolve(fd)
    })
  })
}

function read(path, length) {
  if (!isNaN(length)) {
    return __readLimit(path, length)
  } else {
    return __read(path)
  }
}

function __readLimit(path, length) {
  return new Promise((resolve, reject) => {
    fs.open(path, "r", (err, fd) => {
      if (err) {
        reject(err)
      } else {
        let buf = new Buffer(length)
        fs.read(fd, buf, 0, length, null, (err, bytesRead, buffer) => {
          if (err) {
            reject(err)
          } else {
            resolve({
              bytesRead,
              buffer
            })
          }
          fs.close(fd, err => reject(err))
        })
      }
    })
  })
}

function __read(path) {
  return new Promise((resolve, reject) => {
    const rs = fs.createReadStream(path)
    rs.on('open', () => {
      let chunks = [],
        size = 0
      let buf
      rs.on('data', (chunk) => {
        chunks.push(chunk)
        size += chunk.length
      })
      rs.on('end', () => {
        buf = Buffer.concat(chunks, size)
        if (typeof resolve === 'function') resolve(buf)
      })
    })
    rs.on('error', (err) => {
      console.log('[IO] read: ', err)
      if (typeof reject === 'function') reject(err)
    })
  })
}

function write(filename, data) {
  return new Promise((resolve, reject) => {
    const ws = fs.createWriteStream(filename);
    ws.on('finish', () => {
      console.log(`Finished Writing data to [${filename}].`)
      if (typeof resolve === 'function') resolve()
    })
    ws.on('error', (err) => {
      console.log(err)
      if (typeof reject === 'function') reject(err)
    })
    if (typeof data === 'object')
      data = JSON.stringify(data)
    ws.write(data)
    ws.end()
  })
}

function compressSource(name, type) {
  writeSource(name, type, readSource(name, type))
}

function readSource(name, type) {
  switch (type.toLowerCase()) {
    case 'js':
      const jsfile = path.resolve(__dirname, 'web-src', `${name}.js`)
      const rlt = UglifyJS.minify(jsfile)
      return rlt
      break
    case 'css':
      const css = path.resolve(__dirname, 'web-src', `${name}.css`)
      return UglifyCSS.processFiles([css], {
        maxLineLen: 500,
        expandVars: true
      });
    case 'html':
      fs.createReadStream(path.resolve(__dirname, 'web-src', `${name}.html`))
        .pipe(zlib.createGzip())
        .pipe(fs.createWriteStream(path.resolve(__dirname, `${name}.html`)))
      break
    default:
      throw new Error('Read Source Error: Don\'t know the type.')
  }
}

function writeSource(name, type, rlt) {
  switch (type.toLowerCase()) {
    case 'js':
      writeFile(path.resolve(__dirname, 'static', `${name}.js`), rlt.code)
      if (rlt.map) writeFile(path.resolve(__dirname, 'static', `${name}.js.map`), rlt.map)
      break
    case 'css':
      writeFile(path.resolve(__dirname, 'static', `${name}.css`), rlt)
      break
    default:
      console.log('Write Source Error: Don\'t know the type.')
      break
  }
}
