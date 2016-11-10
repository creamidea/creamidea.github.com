"use strict"

const Posts = require('./Post').Posts
const {
  splitByLine,
  genFileStamp
} = require('./Utils')

class Parser {
  constructor(container) {
    this.__container = container
  }
  orgMode(orgCache) {
    const __container = this.__container
    const PUBPATH = __container.getConfig('PUBPATH')
    splitByLine(orgCache.toString('utf8'), (line, index) => {
      if (index < 3) return // filter the invalid record
      let record = line.slice(1, -1).split(/\s+/) // remove the ()
      if (record.length < 2) return

      let func = record.shift()

      if (record[0].indexOf('X') === 1) {
        // Xxxxxxx
        let [hash, timestamp] = record
        hash = hash.slice(1, -1)
        __container.set(hash, {
          timestamp: +timestamp * 1000,
          hash: hash
        })
      } else {
        let [fullpath] = record
        fullpath = fullpath.slice(1, -1) // remove the ""
        __container.set(genFileStamp(fullpath, PUBPATH), {
          fullpath
        })
      }
    })
  }

  exportMode(exportCache) {
    exportCache = exportCache.toString('utf8')
    if (exportCache) exportCache = JSON.parse(exportCache)
    else exportCache = []
    this.__container.load(exportCache)
  }
}

module.exports = Parser

function parseSitemap(str) {
  let contentArray = str.match(CONTENTREGEXP)
  let max = contentArray.length
  let container = {}
  if (contentArray !== null) {
    contentArray.map((c, i) => {
      let href = c.match(HREFREGEXP)
      if (href) {
        let filename = path.resolve(
          BASEPATH,
          href[1].replace(/html/, 'org'))
        if (i === max - 1) {
          // the end
          readArticle(filename, container, (data) => {
            exportEvent.emit('end', Object.assign({}, data))
          })
        } else {
          readArticle(filename, container)
        }
      }
    })
  }
}
