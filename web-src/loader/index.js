"use strict"

const bios = require('./bios')
bios.start( () => {
  // A new word start
  $.ajax({
    url: '../static/html/sitemap.html',
    type: 'GET',
    dataType: 'html'
  }).then((data) => {
    console.log(data)
  }).fail(() => {

  })

})
