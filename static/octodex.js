#!/usr/bin/env node
// -*- coding: utf-8 -*-

'use strict'

var https = require('https')
var fs = require('fs')
var __forEach = Array.prototype.forEach
var options = {
  hostname: 'octodex.github.com',
  port: 443,
  path: '/',
  method: 'GET'
}
function writeToFile (content) {
  fs.writeFile('octodex-data.js', content, () => {
    console.log('Write Over.');
  })
}

var req = https.request(options, (res) => {

  let chunks = ''
  
  res.on('data', (chunk) => {
    chunks += chunk
  })
  
  res.on('end', () => {
    console.log('HTTP Get over.');
    let pics = []
    __forEach.call(chunks.match(/<img height="424" width="424".*?>/g), function (i) {
      let img = i.match(/data-src="(.*?)" alt="(.*?)"/)
      pics.push({
	'src': img[1],
	'title': img[2]
      })
    })
    __forEach.call(chunks.match(/<p class="number">.*?<\/p>/g), function (n, index) {
      let no = n.match(/(\d+)/)
      pics[index].no = no[1]
    })
    writeToFile(`window.octodex=${JSON.stringify(pics)}`)
  })
  
})
req.end()

req.on('error', (err) => {
  console.error(err)
})

