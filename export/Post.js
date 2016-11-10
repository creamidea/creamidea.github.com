"use strict"

const EventEmitter = require('events')

const io = require('./io')
const Parser = require('./Parser')
const {
  cutout
} = require('./Utils')

class Post {

  constructor() {
    this.__props = {}
  }

  get(key) {
    return this.__props[key]
  }

  getAll() {
    return this.__props
  }

  set(props = {}) {
    Object.assign(this.__props, props)
  }

  update(end) {
    // if (!this.get('fullpath')) console.log(this.getAll())
    const __this = this,
      fullpath = this.get('fullpath'),
      error = this.get('error')

    // Attention:
    // If you have the same filename, it will not be updated.
    // exclude the error files
    if (error) { // ENOENT
      if (typeof end === 'function') end()
      return
    }

    io.stat(fullpath).then(file => {
      const mtime = (new Date(file.mtime)).getTime()

      // exclude the non-modified file
      if (__this.get('mtime') === mtime) {
        if (typeof end === 'function') end()
        return
      }

      __this.set({
        mtime
      })
      io.read(fullpath, 8000 /*how many bytes do you want to read*/ ).then(({
        bytesRead,
        buffer
      }) => {
        const data = buffer.toString("utf8", 0, bytesRead)
        __this.set(cutout(data))
        if (typeof end === 'function') end()
      })
    }).catch(err => {
      console.log('[Post] update: ', err)
      __this.set({
        error: err.code
      })
      if (typeof end === 'function') end()
    })
  }

}

const Posts = {
  __posts: {},
  __config: {},
  __event: new EventEmitter,

  on() {
    this.__event.on.apply(this.__event, arguments)
  },

  get(hash) {
    return this.__posts[hash]
  },
  get length() {
    return Object.keys(this.__posts).length
  },

  set(hash, props = {}) {
    let __posts = this.__posts,
      post = __posts[hash]
    if (!post) {
      // console.log(`[Posts] Not found: ${hash}`)
      __posts[hash] = new Post
      post = __posts[hash]
    }
    post.set(props)
  },

  getAll() {
    return Object.assign({}, this.__posts)
  },

  load(posts = []) {
    const __this = this
    posts.forEach(post => {
      __this.set(post.hash, post)
    })
  },
  save() {
    const posts = Posts.getAll()
    io.write(this.getConfig('CACHEFILE'), Object.keys(posts).map(key => {
      let post = posts[key]
      return post.getAll()
    }))
  },
  ///////////////////////////////////////////////
  setup(config) {
    this.__config = config
  },
  getConfig(name) {
    return this.__config[name]
  },
  //////////////////////////////////////////////
  __update() {
    const posts = Posts.getAll(),
      total = Posts.length,
      event = new EventEmitter,
      channel = 'end' + Math.random(),
      end = ((event, channel) => () => event.emit(channel))(event, channel)

    // listen
    event.on(channel, ((posts, total, __this) => {
      let counter = 0
      return () => {
        counter += 1
        if (counter === total) {
          __this.save()
          __this.__event.emit('end', posts)
        }
      }
    })(posts, total, this))

    // start...
    for (var i in posts) {
      if (posts.hasOwnProperty(i)) {
        let post = posts[i]
        post.update(end)
      }
    }

  },
  update() {
    const {
      ORGCACHEFILE,
      CACHEFILE
    } = this.__config

    Promise.all([io.read(ORGCACHEFILE), io.read(CACHEFILE)])
      .then(caches => {
        const [orgCache, exportCache] = caches

        // parser
        const parser = new Parser(Posts)
        parser.orgMode(orgCache)
        parser.exportMode(exportCache)

        // update
        Posts.__update()
      })
      .catch(err => {
        console.log('[Post] Export: ', err)
      })
  },
  export (view, params) {
    if (typeof view === 'function') {
      let posts = Posts.getAll()
      view.call(null, Object.keys(posts).map(key => {
        let post = posts[key]
        return post.getAll()
      }), params)
    } else {
      throw "[Post] export: I just receive the view function!"
    }
  }
}

module.exports = {
  Posts
}
