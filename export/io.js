"use strict"
////////////////////////////
// Read && Write the File //
////////////////////////////
const fs = require('fs')
const path = require('path')

const UglifyHTML = require('html-minifier')
const UglifyCSS = require('uglifycss')
const UglifyJS = require("uglify-js")
const zlib = require('zlib')

const MINIFYHTMLRULES = {
  collapseBooleanAttributes: true,
  collapseInlineTagWhitespace: true,
  decodeEntities: true,
  minifyCSS: true,
  minifyJS: true,
  removeComments: true,
  removeEmptyAttributes: true,
  // removeEmptyElements: true, // change the this?
  // removeOptionalTags: true, // HTML HEAD BODY THEAD TBODY
  removeRedundantAttributes: true,
  removeScriptTypeAttributes: true,
  removeStyleLinkTypeAttributes: true,
  trimCustomFragments: true
}

module.exports = {
  read,
  stat,
  write,
  compressSource
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

function compressSource({
  file,
  target,
  base
}) {
  const {
    name,
    ext
  } = path.parse(file)
  switch (ext.toLowerCase()) {
    case '.js':
      writeSource({
        ext,
        name,
        data: UglifyJS.minify(file),
        target
      })
      break
    case '.css':
      writeSource({
        ext,
        name,
        data: UglifyCSS.processFiles([file], {
          maxLineLen: 500,
          expandVars: true
        }),
        target
      })
      break
    case '.html':
      read(file).then(html => {
        const uglifed = html.toString('utf8').replace(
          /<(?:link|script).*?(?:href|src)="\/web-src\/.*\/?>/gi,
          rpl => {
            const url = rpl.match(/(?:src|href)="\/web-src\/(.*?)"/)[1]
            const resFilePath = path.resolve(path.parse(file).dir, url.replace(/^\//, ''))
              // console.log('>>> ', rpl, url)
              // console.log('>>>', resFilePath, url.split('.')[1])
            const text = fs.readFileSync(
              resFilePath,
              (err) => {
                if (err) throw err
              })
            return url.split('.')[1] === 'css' ?
              `<style>${text}</style>` :
              `<script>${text}</script>`
          })
        writeSource({
          name,
          ext,
          data: UglifyHTML.minify(uglifed, MINIFYHTMLRULES),
          target
        })
      }).catch(err => {
        console.log(err)
      })
      break
    default:
      throw new Error('[IO] Compress Source Error: Don\'t know the type.')
  }
}

function writeSource({
  name,
  ext,
  data,
  target
}) {
  switch (ext.toLowerCase()) {
    case '.js':
      write(path.resolve(target, `${name}.js`), data.code)
      if (data.map) write(path.resolve(target, `${name}.js.map`), data.map)
      break
    case '.css':
    case '.html':
      write(
        path.resolve(target, `${name}${ext}`),
        data.replace(/^$|\r?\n/g, '').replace(/>\s+</g, '><')
      )
      break
    default:
      throw new Error('[IO] Write Source Error: Don\'t know the type.')
  }
}
