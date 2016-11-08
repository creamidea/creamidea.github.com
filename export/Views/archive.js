"use strict"

const io = require('../io')
const {
  convertToURL,
  splitTags
} = require('../Utils')
const SPECIALFILE = ["works", "friends"]
const URLPREFIX2 = 'https://media.githubusercontent.com' +
  '/media/creamidea' + '/creamidea.github.com/master/static/html/'

function genTagsHtml(tags) {
  let tagsHtml = splitTags(tags).map(tag => {
    return `<a class="tag-item" href="/search?q=${encodeURIComponent(tag)}"` +
      `title="Go to ${tag}" alt="Go to ${tag}">${tag}</a>`
  })
  return `<div class="tags">${tagsHtml.join('')}</div>`
}

module.exports = (data, params) => {
  let special = []
  let years = []
  const options = {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
    timeZoneName: 'short'
  }
  let html = Object.keys(data).sort((a, b) => {
    return data[b].date - data[a].date
  }).map((fileSym) => {
    const {
      fullpath,
      title,
      name,
      category,
      mtime,
      date,
      keywords,
      error
    } = data[fileSym]
    if (error) return // filter the error file
    let urlprefix = params.urlprefix
    if (typeof process.env.NODE_ENV === 'string' &&
      process.env.NODE_ENV.indexOf('production') >= 0) {
      urlprefix = URLPREFIX2
    }
    const _url = convertToURL(fullpath, urlprefix)
    let _html =
      `<li class="${category||'article'}">` +
      `<a class="title" href="${_url}">${title}</a>` +
      `<div class="meta">` + [{
        key: 'create',
        value: date
      }, {
        key: 'update',
        value: mtime
      }].map(function(o) {
        const {
          key,
          value
        } = o
        // console.log(key, new Date(value))
        return `<p class = "${key}-time">` +
          `<span>${key.slice(0, 1).toUpperCase() + key.slice(1)}: </span>` +
          `<date>${(new Date(value)).toLocaleDateString('en-US', options)}</date></p>`
      }).join('') + `</div>${genTagsHtml(keywords)}</li>`

    // select the special files(works, friends)
    if (SPECIALFILE.indexOf(name) >= 0) {
      special.push(_html)
      return
    } else {
      let year = (new Date(date)).getFullYear()
      if (years.indexOf(year) < 0) {
        years.push(year)
        _html = `<li class="year-split"><span>${year}</span></li>${_html}`
      }
      return _html
    }
  })

  io.write(
    params.path,
    `<ul class="article-list">${html.join('')}</ul>` +
    `<ul class="special-list">${special.join('')}</ul>`
    .replace(/^$|\r?\n/g, '').replace(/>\s+</g, '><')
  )
}
