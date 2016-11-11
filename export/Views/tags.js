"use strict"

const io = require('../io')
const {
  convertToURL,
  splitTags
} = require('../Utils')

function analysisTags(files) {
  let _c = {}
  Object.keys(files).map(key => {
    const file = files[key],
      tags = file.keywords
    if (!tags) return
    splitTags(tags).map(name => {
      let sym = Symbol.for(name),
        tag = _c[sym]

      if (typeof tag === 'undefined') {
        tag = _c[sym] = {
          count: 0,
          // filenames: [],
          name: name
        }
      }

      tag.count += 1
      // _c[sym].filenames.push(`${file.category}::${file.name}`)
    })
  })
  return _c
}

module.exports = (posts, params) => {
  const minFont = 10.0,
    maxFont = 35.0,
    diffFont = maxFont - minFont,
    tagsResults = analysisTags(posts)
  let ups = [],
    downs = []
  Object.getOwnPropertySymbols(tagsResults).map(sym => {
    let tag = tagsResults[sym]
      // console.log(tag.name, ':', tag.count)
    ups.push(
        `<li data-weight=${tag.count} style="display:inline"> ` +
        `<a href="#!/tags?tag=${encodeURIComponent(tag.name)}"` +
        ` style="font-size:${((Math.log(tag.count) / Math.log(2)) * diffFont / 6 + minFont).toFixed(2)}px">` +
        `${tag.name}</a><sup>${tag.count}</sup></li>`)
      // downs.push(`<ul class="tag-${encodeURIComponent(tag.name)}" style="display:none;">` + tag.filenames.map(function (filename) {
      //   let post = posts[filename]
      //   if (post.error) {
      //     return ''
      //   } else {
      //     return `<li><a class="title" href="${URLPREFIX}${post.category}/${post.name}.html">${post.title}</a></li>`
      //   }
      // }).join('') + '</ul>')
  })
  downs = Object.keys(posts).map(name => {
    const {
      fullpath,
      keywords,
      title,
      error
    } = posts[name]
    if (error) {
      return ''
    } else {
      const url = convertToURL(fullpath, params.urlprefix)
        // let url = params.urlprefix + splitBySlash(fullpath).slice(-2).join('/').replace('.org', '.html')
      return `<li data-tags="${keywords}">` +
        `<a class="title" href="${url}">${title}</a></li>`
    }
  })

  io.write(
    params.path,
    `<ul class="tag-list" style="padding:0 12px;">${ups.join('')}</ul>` +
    `<ul class="post-list" style="display:none">${downs.join('')}</ul>`
  )
}
