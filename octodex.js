// -*- coding: utf-8 -*-
// 9KB
'use strict'

const https = require('https')
const fs = require('fs')
const path = require('path')

const __forEach = Array.prototype.forEach

var options = {
  hostname: 'octodex.github.com',
  port: 443,
  path: '/',
  method: 'GET'
}

function writeToFile(content) {
  var fullpath = path.resolve(__dirname, 'static', 'octodex-data.js')
  fs.writeFile(fullpath, content, () => {
    console.log(`Write to ${fullpath}.`);
  })
}

const req = https.request(options, (res) => {

  let chunks = ''

  res.on('data', (chunk) => {
    chunks += chunk
  })

  res.on('end', () => {
    console.log('HTTP Get over.');
    let pics = []
    __forEach.call(chunks.match(/<img height="424" width="424".*?>/g), function(i) {
      let img = i.match(/data-src="(.*?)" alt="(.*?)"/)
      pics.push({
        'f': img[1].split('/').pop(), // filename: xxx.png
        't': img[2] // title (caption)
      })
    })
    __forEach.call(chunks.match(/<p class="number">.*?<\/p>/g), function(n, index) {
      let no = n.match(/(\d+)/)
      pics[index].no = no[1]
    })
    writeToFile(`window.octodex=${JSON.stringify(pics)}`)
  })

})

console.log("Start...");
req.end()

req.on('error', (err) => {
  console.error(err)
})
