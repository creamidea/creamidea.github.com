"use strict"

const path = require('path')
const io = require('../io')
const {
  convertToURL
} = require('../Utils')

module.exports = (files, params) => {
  const SITE = 'https://creamidea.github.io/'
  let itemsHTML = Object.keys(files).map(key => {
    const file = files[key]
    if (file.error) return ''
    const {
      fullpath,
      hash,
      title,
      name,
      category,
      mtime,
      date,
      keywords,
      description,
      author
    } = file
    const url = convertToURL(fullpath, params.urlprefix, SITE)
    const _d = `Tags: ${keywords}\nContent: ${description}`
    return '<item>' +
      `<title><![CDATA[${title}]]></title>` +
      `<author>${author}</author>` +
      `<category>${keywords}</category>` +
      `<link>${url}</link>` +
      `<guid>${hash}</guid>` +
      `<pubDate>${new Date(date).toGMTString()}</pubDate>` +
      `<lastBuildDate>${new Date(mtime).toGMTString()}</lastBuildDate>` +
      `<description><![CDATA[${_d}]]></description>`
      // + `<content:encoded xmlns:content="http://purl.org/rss/1.0/modules/content/">${_d}</content:encoded>`
      +
      `<comments>${url}#outline_disqus_thread</comments>` +
      '</item>'
  }).join('')
  const rssXML = '<?xml version="1.0" encoding="utf-8"?>' +
    '<rss version=\"2.0\"' +
    ' xmlns:content=\"http://purl.org/rss/1.0/modules/content/\"' +
    ' xmlns:wfw=\"http://wellformedweb.org/CommentAPI/\"' +
    ' xmlns:dc=\"http://purl.org/dc/elements/1.1/\"' +
    ' xmlns:atom=\"http://www.w3.org/2005/Atom\"' +
    ' xmlns:sy=\"http://purl.org/rss/1.0/modules/syndication/\"' +
    ' xmlns:slash=\"http://purl.org/rss/1.0/modules/slash/\"' +
    ' xmlns:georss=\"http://www.georss.org/georss\"' +
    ' xmlns:geo=\"http://www.w3.org/2003/01/geo/wgs84_pos#\"' +
    ' xmlns:media=\"http://search.yahoo.com/mrss/\">' +
    '<channel>' +
    `<title><![CDATA[C-Tone Homepage]]></title>` +
    `<link>${SITE}</link>`
    // + `<script xmlns="http://www.w3.org/1999/xhtml" src="/public/js/rss.js"></script>`
    +
    `<atom:link href="${SITE}static/rss2.xml" rel="self" type="application/rss+xml"/>` +
    `<description><![CDATA[思考/笔记/翻译/技术/think/note/translation/technology]]></description>` +
    `<pubDate>${(new Date()).toGMTString()}</pubDate>` +
    `<generator>http://orgmode.org/</generator>` +
    itemsHTML + '</channel></rss>'

  io.write(params.path, rssXML)
}
