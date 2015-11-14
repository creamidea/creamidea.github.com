#!/usr/bin/env node

'use strict'

var spawnSync = require('child_process').spawnSync

class Deployer {
  // branch 分支的名称
  // dirname 站点（blog）的路径在哪里
  constructor() {
    if (!dirname) var dirname = __dirname
    this.root = dirname
  }

  start() {
    // console.log(process.argv)
    var comment = process.argv[2]
    var branch = process.argv[3]
    if (this[`push-github-${branch}`]) {
      this['exec-sh'](this[`push-github-${branch}`](comment))
    } else {
      if (process.argv.length > 3) {
        console.log('COMMAND error! The comment must be wrapped by ""');
        console.log('e.g. $ node deploy.js "The comment you want to input."');
        process.exit(0)
      }
      this['exec-sh'](this[`push-github-articles`](comment))
      this['exec-sh'](this[`push-github-master`](comment))
    }
  }

  'exec-sh' (sh) {
    sh.every(function(cwd) {
      if (typeof cwd === 'string' || cwd instanceof String) {
        cwd = cwd.split(' ')
      }
      console.log(`-> ${cwd.join(' ')}`);
      var rlt = spawnSync(cwd.shift(), cwd)
      if (rlt.status === null) {
        console.log(`command cannot found: ${rlt.args[0]}`)
        process.exit(1)
      }
      if (rlt.status === 0) {
        // var stdout = rlt.stdout.toString()
        // console.log(stdout)
        return true
      } else {
        if (rlt.stderr) console.log(rlt.stderr.toString())
        if (rlt.stdout) console.log(rlt.stdout.toString())
        return false
      }
    })
  }

  'push-github-articles' (comment) {
    if (!comment || comment === 'undefined') var comment = "For Deployment " + (new Date())
    var branch = 'articles'
    return [
      `cd ${this.root}`,
      // `git checkout ${branch}`,
      `git add _articles static deploy.js README.org _draft favicon.ico`, // TODO: here will be contain deploy.js
      ['git', 'commit', '-m', `"${comment}"`],
      `git push origin ${branch}:${branch}`
    ]
  }

  'push-github-master' (comment) {
    if (!comment || comment === 'undefined') var comment = "For Deployment " + (new Date())
    var branch = 'master'
    return [
      `cd ${this.root}/public`,
      // `git checkout ${branch}`,
      `git add .`, ['git', 'commit', '-m', `"${comment}"`],
      `git push origin ${branch}:${branch}`
    ]
  }

}

(function() {
  var d = new Deployer
  d.start()
})()
