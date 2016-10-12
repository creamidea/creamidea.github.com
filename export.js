"use strict"

const fs = require('fs')
const crypto = require('crypto')
const sha1 = crypto.createHash('sha1')
const path = require('path')
const EventEmitter = require('events')
const zlib = require('zlib')

// const UglifyHTML = require('html-minifier')
const UglifyCSS = require('uglifycss')
const UglifyJS = require("uglify-js")

const CONTENTREGEXP = /<li><a href=(.*)>/gi
const HREFREGEXP = /href="(.+?)"/i
const TITLEREGEXP = /#\+TITLE:\s*(.+)/i
const DATEREGEXP = /#\+DATE:\s*(.+)/i
const TAGSREGEXP = /#\+KEYWORDS:\s*(.+)/i

const SITEMAPPATH = path.resolve(__dirname, 'static', 'html', 'sitemap.html')
const PUBPATH = path.resolve(__dirname, 'static', 'html/')
const BASEPATH = path.resolve(__dirname, '_content/')
const INDEXHTMLPATH = path.resolve(__dirname, 'index.html')
const ARCHIVEHTMLPATH = path.resolve(__dirname, 'static', 'html', 'archive.html')
const INDEXCSSFILE = path.resolve(__dirname, 'static', 'index.css')
const INDEXJSFILE = path.resolve(__dirname, 'static', 'index.js')
const ORGCACHEFILE = path.resolve(__dirname, '.org-timestamps', 'creamidea-article.cache')
const CACHEFILE = path.resolve(__dirname, '.org-timestamps', 'export-history.cache')

const SPECIALFILE = ["works", "friends"]
const URLPREFIX = '/static/html/'
const URLPREFIX2 = 'https://media.githubusercontent.com/media/creamidea/creamidea.github.com/master/static/html/'

const MINIFYHTMLRULES = {
  collapseBooleanAttributes: true,
  collapseInlineTagWhitespace: true,
  decodeEntities: true,
  minifyCSS: true,
  minifyJS: true,
  removeComments: true,
  removeEmptyAttributes: true,
  removeEmptyElements: true,
  removeOptionalTags: true,
  removeRedundantAttributes: true,
  removeScriptTypeAttributes: true,
  removeStyleLinkTypeAttributes: true,
  trimCustomFragments: true
}

///////////
// Event //
///////////

const exportEvent = new EventEmitter()
exportEvent.on('end', (data) => {
  writeCache(JSON.stringify(data))
  const archiveHtml = genArchiveHtml(data)
  // writeFile(ARCHIVEHTMLPATH, UglifyHTML.minify(archiveHtml, MINIFYHTMLRULES))
  writeFile(ARCHIVEHTMLPATH, archiveHtml.replace(/^$|\r?\n/g, '').replace(/>\s+</g, '><'))
  // fs.writeFile(INDEXHTMLPATH, genHomeHtml(listHtml), (err) => {
  //   if (err) {
  //     console.log(err)
  //   } else {
  //     console.log(`Write to: ${INDEXHTMLPATH}`)
  //   }
  // })
})

////////////////
// DOM Viewer //
////////////////

function genTagsHtml (tags) {
  var tagsHtml
  if (tags && typeof tags.split === 'function') {
    tagsHtml = tags.split(',').map((tag) => {
      return `<a class="tag-item" href="/search?hl=en&q=${encodeURIComponent(tag)}" title="Go to ${tag}">${tag}</a>`
    })
  }
  return `<div class="tags">${tagsHtml.join('')}</div>`
}

function genArchiveHtml (data) {
  let special = []
  let html = Object.keys(data).sort((a, b) => {
    return data[b].mtime - data[a].mtime
  }).map((fileSym) => {
    const {title, name, category, mtime, date, tags} = data[fileSym]
    let urlprefix = URLPREFIX
    if (typeof process.env.NODE_ENV === 'string' && process.env.NODE_ENV.indexOf('production') >= 0) {
      urlprefix = URLPREFIX2
    }
    let _html = `
<li class="${category}"><a class="title" href="${urlprefix+category+'/'+name}.html">${title}</a>
<div class="meta">
<p class="create-time"><span>Create: </span><date>${date}</date></p>
<p class="update-time"><span>Update: </span><date>${new Date(mtime).toISOString().replace(/T/, ' ').replace(/\..+/, '')}</date></p>
</div>
${genTagsHtml(tags)}</li>`

    if (SPECIALFILE.indexOf(name) >= 0) {
      special.push(_html)
      return
    } else {
      return _html
    }
  })
  return `<ul class="article-list">${html.join('')}</ul><ul class="special-list">${special.join('')}</ul>`
}

///////////
// Utils //
///////////

function getCategoryAndFilename(fullpath, basepath) {
  let relativePath = fullpath.slice(basepath.length)
  let [category, filename] = relativePath.slice(1).split(/[\\/]/)
  if (["articles", "wiki", "translation"].indexOf(category) >= 0) {
    return [category, path.basename(filename, '.org')]
  } else {
    return [null, null]
  }
}

function generateFileStamp(fullname) {
  let s = `${fullname}::${PUBPATH.replace(/\\/g,"/").replace(/(\w):/, (a) => { return a.toLowerCase() }) + '/'}::org-html-publish-to-html`
  return 'X' + crypto.createHash('sha1').update(s).digest('hex')
}

function attachTimestamp(hashs, files) {
  // let sFiles = Object.getOwnPropertySymbols(files)
  let sFiles = Object.keys(files)

  sFiles.map((sFile) => {
    let file = files[sFile]
    let stamp = generateFileStamp(file.fullpath)
    Object.assign(file, {
      timestamp: hashs[stamp]
    })
  })
}

function readArticle (category, filename, container, callback) {
  let pubFullpath = path.resolve(PUBPATH, category, filename) + '.html'
  let baseFullpath = path.resolve(BASEPATH, category, filename) + '.org'
  let sym = `${category}::${filename}`
  Object.assign(container[sym], {
    name: filename,
    category: category
  })
  fs.stat(baseFullpath, (err, data) => {
    if (err) {
      console.log(err)
    } else {
      Object.assign(container[sym], {
        mtime: (new Date(data.mtime)).getTime()
      })
      fs.open(baseFullpath, "r", (err, fd) => {
        let length = 500
        let buf = new Buffer(length)
        fs.read(fd, buf, 0, length, null, (err, bytesRead, buffer) => {
          if (err) {
            console.log(err)
          } else {
            const data = buffer.toString("utf8", 0, buffer.length)
            const date = data.match(DATEREGEXP)
            const tags = data.match(TAGSREGEXP)
            const title = data.match(TITLEREGEXP)
            Object.assign(container[sym], {
              title: title && title[1],
              date: date && date[1],
              tags: tags && tags[1]
            })
          }
          fs.close(fd)
          if (typeof callback === 'function') callback(container)
        })
      })
    }
  })
}

function readAllArticles(files) {
  // let sFiles = Object.getOwnPropertySymbols(files)
  let sFiles = Object.keys(files)
  let max = sFiles.length

  sFiles.map((sFile, index) => {
    let file = files[sFile]
    let [category, filename] = getCategoryAndFilename(file.fullpath, BASEPATH)
    if (category === null || filename === null) return

    if (index === max - 1) {
      // the end
      readArticle(category, filename, files, (data) => {
        exportEvent.emit('end', Object.assign({}, data))
      })
    } else {
      readArticle(category, filename, files)
    }

  })
}

////////////////////////////
// Read && Write the File //
////////////////////////////

function readFile(filename) {
  return new Promise((resolve, reject) => {
    const rs = fs.createReadStream(filename)
    rs.on('open', () => {
      let chunks = [], size = 0
      let buf
      rs.on('data', (chunk) => {
        chunks.push(chunk)
        size += chunk.length
      })
      rs.on('end', () => {
        buf = Buffer.concat(chunks, size)
        if(typeof resolve === 'function') resolve(buf)
      })
    })
    rs.on('error', (err) => {
      console.log(err.stack)
      if(typeof reject === 'function') reject(err)
    })
  })
}

function writeFile(filename, data) {
  return new Promise((resolve, reject) => {
    const ws = fs.createWriteStream(filename);
    ws.on('finish', () => {
      console.log(`Write data to ${filename} finished.`)
      if (typeof resolve === 'function') resolve()
    })
    ws.on('error', (err) => {
      console.log(err)
      if (typeof reject === 'function') reject()
    })
    ws.write(data)
    ws.end()
  })
}

function writeCache(data) {
  writeFile(CACHEFILE, data)
}

function readCache() {
  readFile(CACHEFILE).then((buf) => {
    console.log(buf.toString())
  })
}

function compressSource(name, type) {
  writeSource(name, type, readSource(name, type))
}

function readSource(name, type) {
  switch(type.toLowerCase()) {
  case 'js':
    const js = path.resolve(__dirname, 'web-src', `${name}.js`)
    return UglifyJS.minify(js, {
      outSourceMap: `${name}.js.map`
    });
    break
  case 'css':
    const css = path.resolve(__dirname, 'web-src', `${name}.css`)
    return UglifyCSS.processFiles([css], {
      maxLineLen: 500, expandVars: true
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
  switch(type.toLowerCase()) {
  case 'js':
    writeFile(path.resolve(__dirname, 'static', `${name}.js`), rlt.code)
    writeFile(path.resolve(__dirname, 'static', `${name}.js.map`), rlt.map)
    break
  case 'css':
    writeFile(path.resolve(__dirname, 'static', `${name}.css`), rlt)
    break
  default:
    console.log('Write Source Error: Don\'t know the type.')
    break
  }
}

////////////
// Parser //
////////////

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

function parseOrgCache(cache) {
  let hashs = {}, files = {}, container = {}

  cache.split(/\r?\n/).map( (line) => {
    let record = line.slice(1, -1).split(/\s+/)
    if (record.length < 2) return
    let func = record.shift()
    if (record[0].indexOf('X') === 1) {
      // Xxxxxxx
      let [hash, timestamp] = record
      hashs[hash.slice(1,-1)] = +timestamp*1000
    } else {
      let [fullpath] = record
      fullpath = fullpath.slice(1,-1)
      let [category, filename] = getCategoryAndFilename(fullpath, BASEPATH)
      if (category === null || filename === null) return

      files[`${category}::${filename}`] = {
        fullpath: fullpath
      }
    }
  })

  attachTimestamp(hashs, files)
  readAllArticles(files)
}

////////////
// Loader //
////////////

function loadSitemap () {
  readFile(SITEMAPPATH).then((buf) => {
    parseSitemap(buf.toString())
  })
}

function loadOrgCache () {
  readFile(ORGCACHEFILE).then((buf) => {
    parseOrgCache(buf.toString())
  })
}

///////////
// Entry //
///////////

// loadSitemap()
// console.log((PUBPATH.replace(/\\/g,"/")+'/').replace(/(\w):/, (a) => {
//   return a.toLowerCase()
// }))
// console.log(BASEPATH)
// loadOrgCache()

const command = {
  archive: loadOrgCache,
  "article-static": function () {
    compressSource('article', 'js')
    compressSource('article', 'css')
  },
  "index-static": function () {
    let js = readSource('index', 'js')
    let css = readSource('index', 'css')
    readFile(path.resolve(__dirname, 'web-src', 'index.html'))
      .then((data) => {
        let html = data.toString()
        let rlt = html
            .replace('<link rel="stylesheet" href="/web-src/index.css" type="text/css"/>', `<style>${css}</style>`)
            .replace('<script src="/web-src/index.js"></script>', `<script>${js.code}</script>`)
            .replace(/^$|\r?\n/g, '').replace(/>\s+</g, '><')
        writeFile(path.resolve(__dirname, 'index.html'), rlt)
        // writeFile(path.resolve(__dirname, 'index.html'), UglifyHTML.minify(rlt))
      })
    // let rlt = readSource('index', 'html')
    // console.log(rlt)
  },
  "about-static": function () {
    readFile(path.resolve(__dirname, 'web-src', 'about.html'))
      .then((data) => {
        let html = data.toString()
        let rlt = html
            .replace(/^$|\r?\n/g, '').replace(/>\s+</g, '><')
        writeFile(path.resolve(__dirname, 'static', 'about.html'), rlt)
      })
  }
}

try {
  command[process.argv[2]]()
} catch (err) {
  console.log(`I don't know what to do with ${process.argv[2]}.`)
  console.log(err)
}
