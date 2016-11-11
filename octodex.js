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
  const newContent = `window.octodex=${content}`
  const fullpath = path.resolve(__dirname, 'static', 'octodex-data.js')

  fs.readFile(fullpath, (err, oldContent) => {
    if (err ||
        Buffer.compare(oldContent,Buffer.from(newContent)) === 0) {

      // different: update the file
      fs.writeFile(fullpath, newContent, () => {
        console.log(`[Octodex] Has written to ${fullpath}.`);
      })

    } else {

      // same: no changes
      console.log('[Octodex] There is no changes. Dropped.')

    }

  })
}

const req = https.request(options, (res) => {

  let chunks = ''

  res.on('data', (chunk) => {
    chunks += chunk
  })

  res.on('end', () => {
    console.log('[Octodex] Getting from remote done.');
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
    writeToFile(JSON.stringify(pics))
  })

})

console.log("[Octodex] Start...");
req.end()

req.on('error', (err) => {
  console.error('[Octodex]', err)
})
