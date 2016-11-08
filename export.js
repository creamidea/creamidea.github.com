"use strict"

// const CONTENTREGEXP = /<li><a href=(.*)>/gi
// const HREFREGEXP = /href="(.+?)"/i

const path = require('path')
const Command = require('./export/Command')
const command = new Command(path.resolve(__dirname, '.'))
try {
  command[process.argv[2]].apply(command, process.argv.slice(3))
} catch (err) {
  console.log(`I don't know what to do with ${process.argv[2]}.`)
  console.log(err)
}
