"use strict"

const path = require('path')
const crypto = require('crypto')
module.exports = {
  convertToURL,
  splitBySlash,
  splitByLine,
  splitTags,
  genFileStamp,
  cutout
}

function convertToURL(fullpath, pathname, site='') {
  return site + pathname +
    splitBySlash(fullpath).slice(-2).join('/').replace('.org', '.html')
}

function splitByLine(data, cb) {
  return data.split(/\r?\n/).map(cb)
}

function splitBySlash(fullpath) {
  return fullpath.split(/\/|\\\\/g)
}

function splitTags(tags) {
  return tags.split(',')
}

function genFileStamp(fullname, pubpath) {
  // pubpath = 'c:/Users/creamidea/Repository/creamidea/_content/'
  pubpath = pubpath.replace(/\\/g, "/").replace(/(\w):/, a => {
    return a.toLowerCase()
  }) + '/'
  let s = `${fullname}::${pubpath}::org-html-publish-to-html`
    // console.log(fullname, 'X' + crypto.createHash('sha1').update(s).digest('hex'))
  return 'X' + crypto.createHash('sha1').update(s).digest('hex')
}

function cutout(data) {
  let meta = {}
  let asterisk = 0
  meta.description = splitByLine(data, function(line) {
    if (line.search(/^#\+/) === 0 &&
      asterisk === 0) {
      let pos = line.indexOf(':')
      if (pos < 0) return;

      let name = line.slice(2, pos).toLowerCase()
      let value = line.slice(pos + 1).trim()

      if (name === 'date') {
        value = (function(date) {
          let _d = date
          let [year, month, day] = _d.split('-')
          return (new Date(Date.UTC(year, (+month) - 1, day, 8, 0, 0)).getTime()) // Beijing
        })(value)
      }

      meta[name] = value
    }
    if (line.search(/^\*/) === 0) {
      asterisk += 1
    }
    if (asterisk === 1) return line
  }).join('')

  if (typeof meta.author === 'undefined')
    meta.author = '冰糖火箭筒(Junjia Ni)'

  return meta
}
