"use strict"

const child_process = require('child_process')
const path = require('path')
const {
  compressSource
} = require('./io')
const {
  splitBySlash
} = require('./Utils')

class Command {

  constructor(dir) {
    this.__path = dir
    const __static = {
      BASEPATH: path.resolve(dir, '_content/'),
      PUBPATH: path.resolve(dir, 'static', 'html/'),
      WEBSRCPATH: path.resolve(dir, 'web-src/'),
      STATICPATH: path.resolve(dir, 'static/'),

      ORGCACHEFILE: path.resolve(dir, '.org-timestamps', 'creamidea-article.cache'),
      CACHEFILE: path.resolve(dir, '.org-timestamps', 'export-history.cache'),

      ARCHIVEHTMLFILE: path.resolve(dir, 'static', 'html', 'archive.html'),
      TAGSHTMLFILE: path.resolve(dir, 'static', 'html', 'tags.html'),
      RSSFILE: path.resolve(dir, 'static', 'rss2.xml')
    }
    this.static = __static
  }

  archive(force) {
    const {
      PUBPATH,
      ORGCACHEFILE,
      CACHEFILE,
      ARCHIVEHTMLFILE,
      TAGSHTMLFILE,
      RSSFILE
    } = this.static

    const Posts = require('./Post').Posts
    const rssView = require('./Views/rss')
    const archiveView = require('./Views/archive')
    const tagsView = require('./Views/tags')
    const URLPREFIX = '/static/html/'

    Posts.setup({
      ORGCACHEFILE,
      CACHEFILE,
      PUBPATH,
      CACHEFILE
    })
    Posts.update()
    Posts.on('end', () => {
      Posts.export(archiveView, {
        path: ARCHIVEHTMLFILE,
        urlprefix: URLPREFIX
      })
      Posts.export(tagsView, {
        path: TAGSHTMLFILE,
        urlprefix: URLPREFIX
      })
      Posts.export(rssView, {
        path: RSSFILE,
        urlprefix: URLPREFIX.slice(1)
      })
    })
  }

  "article-static" () {
    const {
      WEBSRCPATH,
      STATICPATH
    } = this.static
    compressSource({
      file: path.resolve(WEBSRCPATH, 'article.js'),
      target: STATICPATH
    })
    compressSource({
      file: path.resolve(WEBSRCPATH, 'article.css'),
      target: STATICPATH
    })
  }

  "index-static" () {
    const {
      WEBSRCPATH,
      STATICPATH
    } = this.static
    compressSource({
      file: path.resolve(WEBSRCPATH, 'index.html'),
      target: this.__path,
      base: this.__path
    })
  }

  "about-static" () {
    const {
      WEBSRCPATH,
      STATICPATH
    } = this.static
    compressSource({
      file: path.resolve(WEBSRCPATH, 'about.html'),
      target: STATICPATH
    })
  }

  add(f) {
    const {
      PUBPATH,
      BASEPATH,
      RSSFILE,
      ARCHIVEHTMLFILE,
      TAGSHTMLFILE
    } = this.static

    const [type, file] = splitBySlash(f).slice(-2)
    const filename = file.split('.')[0]
    const command = path.resolve('c:\\', 'Program Files', 'Git', 'cmd', 'git')
    const args = [BASEPATH, PUBPATH].map(function(p, index) {
      return path.resolve(p, type, filename) + (index === 0 ? '.org' : '.html')
    })
    console.log(`--> ${command} add ${args.join(' ')}`)
    const result = child_process.spawnSync(
      command,
      Array.prototype.concat.call(['add', RSSFILE, ARCHIVEHTMLFILE, TAGSHTMLFILE], args), {
        cwd: path.resolve(__dirname)
      }
    )
    if (result.status !== 0) {
      console.error('[Error: ' + result.status + '] ' + result.stderr.toString())
      return
    }
    if (result.stdout.length > 0) console.log(result.stdout.toString())
      // const r2 = child_process.execSync('git push origin master', {cwd: path.resolve(__dirname)})
      // if (r2.statue !== 0)
      //   console.error('[Error: '+ r2.status +'] ' + r2.stderr.toString())
      // console.log('Push over.')
  }
}

module.exports = Command
