"use strict"

const fs = require('fs')
const crypto = require('crypto')
const sha1 = crypto.createHash('sha1')
const path = require('path')
const EventEmitter = require('events')
const zlib = require('zlib')
const child_process = require('child_process')

// const UglifyHTML = require('html-minifier')
const UglifyCSS = require('uglifycss')
const UglifyJS = require("uglify-js")

const CONTENTREGEXP = /<li><a href=(.*)>/gi
const HREFREGEXP = /href="(.+?)"/i
const CATEGORYREGEXP = /#\+CATEGORY:\s*?(.+)/i

const SITEMAPPATH = path.resolve(__dirname, 'static', 'html', 'sitemap.html')
const PUBPATH = path.resolve(__dirname, 'static', 'html/')
const BASEPATH = path.resolve(__dirname, '_content/')
const INDEXHTMLPATH = path.resolve(__dirname, 'index.html')
const ARCHIVEHTMLPATH = path.resolve(__dirname, 'static', 'html', 'archive.html')
const INDEXCSSFILE = path.resolve(__dirname, 'static', 'index.css')
const INDEXJSFILE = path.resolve(__dirname, 'static', 'index.js')
const ORGCACHEFILE = path.resolve(__dirname, '.org-timestamps', 'creamidea-article.cache')
const CACHEFILE = path.resolve(__dirname, '.org-timestamps', 'export-history.cache')
const RSSFILE = path.resolve(__dirname, 'static', 'rss2.xml')

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
  command.rss(data)
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
  var tagsHtml = []
  if (tags && typeof tags.split === 'function') {
    tagsHtml = tags.split(',').map((tag) => {
      return `<a class="tag-item" href="/search?hl=en&q=${encodeURIComponent(tag)}" title="Go to ${tag}">${tag}</a>`
    })
  }
  return `<div class="tags">${tagsHtml.join('')}</div>`
}

function genArchiveHtml (data) {
  let special = []
  const options = {
    weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
    timeZone: 'UTC', timeZoneName: 'short'
  }
  let html = Object.keys(data).sort((a, b) => {
    return data[b].mtime - data[a].mtime
  }).map((fileSym) => {
    const {title, name, category, mtime, date, tags, error} = data[fileSym]
    if (error) return
    let urlprefix = URLPREFIX
    if (typeof process.env.NODE_ENV === 'string' && process.env.NODE_ENV.indexOf('production') >= 0) {
      urlprefix = URLPREFIX2
    }
    let _html = `
<li class="${category}"><a class="title" href="${urlprefix+category+'/'+name}.html">${title}</a>
<div class="meta">
${Array.prototype.map.call([{key: 'create', value: date}, {key: 'update', value: mtime}], function (o) {
const {key, value} = o
return `<p class="${key}-time">`
+ `<span>${key.slice(0, 1).toUpperCase() + key.slice(1)}: </span>`
+ `<date>${(new Date(value)).toLocaleDateString('en-US', options)}</date></p>`
}).join('')}
</div>
${genTagsHtml(tags)}</li>`
// new Date(mtime).toISOString().replace(/T/, ' ').replace(/\..+/, '')
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

function cutout(data) {
  let meta = {}
  let asterisk = 0
  meta.description = data.split(/\r?\n/g).map(function (line) {
    if (line.search(/^#\+/) === 0 &&
        asterisk === 0) {
      let pos = line.indexOf(':')
      if (pos < 0) return;

      let name = line.slice(2, pos).toLowerCase()
      let value = line.slice(pos+1).trim()

      if (name === 'date') {
        value = (function (date) {
          let _d = date
          let [year, month, day] = _d.split('-')
          return (new Date(Date.UTC(year, month, day, 8, 0, 0)).getTime()) // Beijing
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

function readArticle (category, filename, container, callback) {
  let pubFullpath = path.resolve(PUBPATH, category, filename) + '.html'
  let baseFullpath = path.resolve(BASEPATH, category, filename) + '.org'
  let sym = `${category}::${filename}`
  Object.assign(container[sym], {
    name: filename,
    category: category
  })
  fs.stat(baseFullpath, (err, data) => {
    // test the file and get the basic information of the file
    if (err) {
      console.log(err.message)
      return Object.assign(container[sym], {
        error: err.code
      })
    }
    Object.assign(container[sym], {
      mtime: (new Date(data.mtime)).getTime()
    })
    fs.open(baseFullpath, "r", (err, fd) => {
      if (err) {
        console.log(err)
        return Object.assign(container[sym], {
          error: err.code
        })
      }
      let length = 8000
      let buf = new Buffer(length)
      fs.read(fd, buf, 0, length, null, (err, bytesRead, buffer) => {
        if (err) {
          console.log(err)
          return Object.assign(container[sym], {
            error: err.code
          })
        } else {
          const data = buffer.toString("utf8", 0, bytesRead)
          // const data = buffer.toString("utf8", 0, buffer.length)
          // const category = data.match(CATEGORYREGEXP) // has be defined above
          const { title, author, keywords, date, description } = cutout(data)
          Object.assign(container[sym], {
            title: title,
            date: date,
            tags: keywords,
            author: author,
            category: category, // dirname
            description: description
          })
        }
        fs.close(fd)
        if (typeof callback === 'function') callback(container)
      })
    })
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
    const jsfile = path.resolve(__dirname, 'web-src', `${name}.js`)
    const rlt = UglifyJS.minify(jsfile) /*, {
      outSourceMap: `../static/${name}.js.map`
    });*/
    return rlt
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

  cache.split(/\r?\n/).map( (line, index) => {
    if (index < 3) return
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
  },
  "rss": function (files) {
    // Object.keys(files).map(function (file) => {
    //   const {title, name, category, mtime, date, tags, error, discription } = file[fileSym]
    // })
    // console.log(files)
    const SITE = 'https://creamidea.github.io/'
    let itemsHTML = Object.keys(files).map(key => {
      const file = files[key]
      if (file.error) return ''
      const {title, name, category, mtime, date, tags, description, author} = file
      const url = `${SITE}static/html/${category}/${name}.html`
      const _d = `Tags: ${tags}\nContent: ${description}`
      return '<item>'
        + `<title><![CDATA[${title}]]></title>`
        + `<author>${author}</author>`
        + `<category>${tags}</category>`
        + `<link>${url}</link>`
        + `<guid>${category}/${name}</guid>`
        + `<pubDate>${new Date(date).toGMTString()}</pubDate>`
        + `<lastBuildDate>${new Date(mtime).toGMTString()}</lastBuildDate>`
        + `<description><![CDATA[${_d}]]></description>`
        // + `<content:encoded xmlns:content="http://purl.org/rss/1.0/modules/content/">${_d}</content:encoded>`
        + `<comments>${url}#outline_disqus_thread</comments>`
        + '</item>'
    }).join('')
    const rss = '<?xml version="1.0" encoding="utf-8"?>'
          + '<rss version=\"2.0\"'
          + ' xmlns:content=\"http://purl.org/rss/1.0/modules/content/\"'
          + ' xmlns:wfw=\"http://wellformedweb.org/CommentAPI/\"'
          + ' xmlns:dc=\"http://purl.org/dc/elements/1.1/\"'
          + ' xmlns:atom=\"http://www.w3.org/2005/Atom\"'
          + ' xmlns:sy=\"http://purl.org/rss/1.0/modules/syndication/\"'
          + ' xmlns:slash=\"http://purl.org/rss/1.0/modules/slash/\"'
          + ' xmlns:georss=\"http://www.georss.org/georss\"'
          + ' xmlns:geo=\"http://www.w3.org/2003/01/geo/wgs84_pos#\"'
          + ' xmlns:media=\"http://search.yahoo.com/mrss/\">'
          + '<channel>'
          + `<title><![CDATA[C-Tone Homepage]]></title>`
          + `<link>${SITE}</link>`
          // + `<script xmlns="http://www.w3.org/1999/xhtml" src="/public/js/rss.js"></script>`
          + `<atom:link href="/static/rss2.xml" rel="self" type="application/rss+xml"/>`
          + `<description><![CDATA[想法，随笔，思考，感叹，笔记，翻译，技术]]></description>`
          + `<pubDate>${(new Date()).toGMTString()}</pubDate>`
          + `<generator>http://orgmode.org/</generator>`
          + itemsHTML + '</channel></rss>'
    writeFile(RSSFILE, rss)
  },
  "add": function (f, sep) {
    console.log(f)
    const [type, file] = f.split(sep || path.sep).slice(-2)
    const filename = file.split('.')[0]
    const command = path.resolve('c:\\', 'Program Files', 'Git', 'cmd', 'git')
    const args = [BASEPATH, PUBPATH].map(function (p, index) {
      return path.resolve(p, type, filename) + (index === 0 ? '.org' : '.html')
    })
    console.log(`--> ${command} add ${args.join(' ')}`)
    const result = child_process.spawnSync(
      command,
      Array.prototype.concat.call(['add', RSSFILE, ARCHIVEHTMLPATH], args),
      {
        cwd: path.resolve(__dirname)
      }
    )
    if (result.status !== 0) {
      console.error('[Error: '+ result.status +'] ' + result.stderr.toString())
      return
    }
    if (result.stdout.length > 0) console.log(result.stdout.toString())
    // const r2 = child_process.execSync('git push origin master', {cwd: path.resolve(__dirname)})
    // if (r2.statue !== 0)
    //   console.error('[Error: '+ r2.status +'] ' + r2.stderr.toString())
    // console.log('Push over.')
  }
}

try {
  command[process.argv[2]].apply(command, process.argv.slice(3))
} catch (err) {
  console.log(`I don't know what to do with ${process.argv[2]}.`)
  console.log(err)
}
