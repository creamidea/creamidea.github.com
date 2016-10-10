"use strict"

var head = document.getElementsByTagName('head')[0]
var script = document.createElement('script')
script.async = true
script.src = '//cdn.bootcss.com/jquery/3.1.1/jquery.min.js'

module.exports = {
  start: (next) => {
    if (typeof script.onload !== 'function') {
      script.onload = () => {
        console.log('loaded over.')
        next()
      }
    }
    head.appendChild(script)
    console.log('loading...')
  }
}
