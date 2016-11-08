"use strict"

// // const sha1 = crypto.createHash('sha1')
const path = require('path')
  // const EventEmitter = require('events')
  // const zlib = require('zlib')
  // const child_process = require('child_process')

// // const UglifyHTML = require('html-minifier')
// const UglifyCSS = require('uglifycss')
// const UglifyJS = require("uglify-js")

// const CONTENTREGEXP = /<li><a href=(.*)>/gi
// const HREFREGEXP = /href="(.+?)"/i
// const CATEGORYREGEXP = /#\+CATEGORY:\s*?(.+)/i

const SITEMAPPATH = path.resolve(__dirname, 'static', 'html', 'sitemap.html')
const BASEPATH = path.resolve(__dirname, '_content/')

const ORGCACHEFILE = path.resolve(__dirname, '../', '.org-timestamps', 'creamidea-article.cache')
const CACHEFILE = path.resolve(__dirname, '../', '.org-timestamps', 'export-history.cache')
const PUBPATH = path.resolve(__dirname, '../', 'static', 'html/')
const ARCHIVEHTMLFILE = path.resolve(__dirname, '../', 'static', 'html', 'archive.html')
const TAGSHTMLFILE = path.resolve(__dirname, '../', 'static', 'html', 'tags.html')
const RSSFILE = path.resolve(__dirname, '../', 'static', 'rss2.xml')
const URLPREFIX = '/static/html/'

const Posts = require('./Post').Posts
const rssView = require('./Views/rss')
const archiveView = require('./Views/archive')
const tagsView = require('./Views/tags')
Posts.setup({ORGCACHEFILE, CACHEFILE, PUBPATH, CACHEFILE})
Posts.update()
Posts.on('end', () => {
  Posts.export(archiveView, {path: ARCHIVEHTMLFILE, urlprefix: URLPREFIX})
  Posts.export(tagsView, {path: TAGSHTMLFILE, urlprefix: URLPREFIX})
  Posts.export(rssView, {path: RSSFILE, urlprefix: URLPREFIX.slice(1)})
})

// ///////////
// // Event //
// ///////////

// const exportEvent = new EventEmitter()
// exportEvent.on('end', (posts, tagsResults) => {
//   writeCache({posts: posts, tags: tagsResults})
//   const archiveHtml = genArchiveHtml(posts)
//   const tagsResultsJson = genTagsResultsJson(tagsResults, posts)
//   const rss = genRSS(posts)
//   // writeFile(ARCHIVEHTMLFILE, UglifyHTML.minify(archiveHtml, MINIFYHTMLRULES))
//   writeFile(ARCHIVEHTMLFILE, archiveHtml)
//   writeFile(TAGSHTMLFILE, tagsResultsJson)
//   writeFile(RSSFILE, rss)
// })

// ///////////
// // Utils //
// ///////////



// function splitTags (tags, cb) {
//   return tags.split(',').map(cb)
// }

// function getCategoryAndFilename(fullpath, basepath) {
//   let relativePath = fullpath.slice(basepath.length)
//   let [category, filename] = relativePath.slice(1).split(/[\\/]/)
//   if (["articles", "wiki", "translation"].indexOf(category) >= 0) {
//     return [category, path.basename(filename, '.org')]
//   } else {
//     return [null, null]
//   }
// }

// const command = {
//   archive: (force) => {
//     Promise.all([readOrgCache(), readCache()]).then( values => {
//       let [orgCache, exportCache] = values
//       mergeCache(orgCache, exportCache).then(
//         d => {
//           attachTimestamp(d.hashs, d.files)
//           readAllArticles(d.files, force)
//         })
//     }).catch(err => {
//       console.log(err)
//     })
//   },
//   "article-static": function () {
//     compressSource('article', 'js')
//     compressSource('article', 'css')
//   },
//   "index-static": function () {
//     let js = readSource('index', 'js')
//     let css = readSource('index', 'css')
//     readFile(path.resolve(__dirname, 'web-src', 'index.html'))
//       .then((data) => {
//         let html = data.toString()
//         let rlt = html
//             .replace('<link rel="stylesheet" href="/web-src/index.css" type="text/css"/>', `<style>${css}</style>`)
//             .replace('<script src="/web-src/index.js"></script>', `<script>${js.code}</script>`)
//             .replace(/^$|\r?\n/g, '').replace(/>\s+</g, '><')
//         writeFile(path.resolve(__dirname, 'index.html'), rlt)
//         // writeFile(path.resolve(__dirname, 'index.html'), UglifyHTML.minify(rlt))
//       })
//     // let rlt = readSource('index', 'html')
//     // console.log(rlt)
//   },
//   "about-static": function () {
//     readFile(path.resolve(__dirname, 'web-src', 'about.html'))
//       .then((data) => {
//         let html = data.toString()
//         let rlt = html
//             .replace(/^$|\r?\n/g, '').replace(/>\s+</g, '><')
//         writeFile(path.resolve(__dirname, 'static', 'about.html'), rlt)
//       })
//   },
//   "add": function (f, sep) {
//     console.log(f)
//     const [type, file] = f.split(sep || path.sep).slice(-2)
//     const filename = file.split('.')[0]
//     const command = path.resolve('c:\\', 'Program Files', 'Git', 'cmd', 'git')
//     const args = [BASEPATH, PUBPATH].map(function (p, index) {
//       return path.resolve(p, type, filename) + (index === 0 ? '.org' : '.html')
//     })
//     console.log(`--> ${command} add ${args.join(' ')}`)
//     const result = child_process.spawnSync(
//       command,
//       Array.prototype.concat.call(['add', RSSFILE, ARCHIVEHTMLFILE, TAGSHTMLFILE], args),
//       {
//         cwd: path.resolve(__dirname)
//       }
//     )
//     if (result.status !== 0) {
//       console.error('[Error: '+ result.status +'] ' + result.stderr.toString())
//       return
//     }
//     if (result.stdout.length > 0) console.log(result.stdout.toString())
//     // const r2 = child_process.execSync('git push origin master', {cwd: path.resolve(__dirname)})
//     // if (r2.statue !== 0)
//     //   console.error('[Error: '+ r2.status +'] ' + r2.stderr.toString())
//     // console.log('Push over.')
//   }
// }

// try {
//   command[process.argv[2]].apply(command, process.argv.slice(3))
// } catch (err) {
//   console.log(`I don't know what to do with ${process.argv[2]}.`)
//   console.log(err)
// }
