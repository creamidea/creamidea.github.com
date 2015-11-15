#!/usr/bin/env node

/*
 * 这个是部署脚本，并不用于解决冲突。
 * 一般情况下，public中的文件是全量同步的，并不会有冲突
 * 而_articles中的文件是有可能冲突的，当冲突发生时，需要人工手动解决。
 * 关于node变换执行命令的位置 https://nodejs.org/api/process.html#process_process_chdir_directory
 */

'use strict'
var spawnSync = require('child_process').spawnSync
var colors = require('colors')

class Deployer {
  // branch 分支的名称
  // dirname 站点（blog）的路径在哪里
  constructor() {
    if (!dirname) var dirname = __dirname
    this.root = dirname
  }

  start() {
    // console.log(process.argv)
    var branch = process.argv[2]
    var files = process.argv[3]
    var comment = process.argv[4]
    this['exec-sh'](this['git-add-commit-push'](branch, files, comment))
  }

  'exec-sh' (sh) {
    var dirname = sh.shift()
    sh.every(function(cwd) {
      process.chdir(dirname)
      // console.log(`Now in ${dirname}`)
      if (typeof cwd === 'string' || cwd instanceof String) {
        cwd = cwd.split(' ')
      }
      // console.log(`$ ${cwd.join(' ')} [process:${process.pid}]`.green)
      process.send({stdout: `$ ${cwd.join(' ')} [process:${process.pid}]`, status: 0})
      var rlt = spawnSync(cwd.shift(), cwd)
      if (rlt.status === null) {
        console.log(`command cannot found: ${rlt.args[0]}`.red)
        process.send({stdout:'command cannot found: ${rlt.args[0]}', status: 2})
        process.exit(2)
      }
      if (rlt.status === 0) {
        var stdout = rlt.stdout.toString()
        // console.log(stdout)
        if (stdout) process.send({stdout: stdout, status: 0})
        return true
      } else {
        if (rlt.stderr) {
          console.log(rlt.stderr.toString().red, rlt.stdout.toString())
          process.send({stderr: rlt.stderr.toString(), stdout: rlt.stdout.toString(), status: rlt.status})
        }
        // else if (rlt.stdout) process.send({fd: 'stdout', hint: rlt.stdout.toString(), status: rlt.status})
        return false
      }
    })
  }

  'git-add-commit-push' (branch, files, comment) {
    var dirname = this.root

    if (!files || files === 'undefined') {
      console.log('git add files none.'.red)
      process.exit(0)
    }
    if (!branch || branch === 'undefined') var branch = "master"
    if (!comment || comment === 'undefined') var comment = "Publish at " + (new Date())
    if (branch === 'master') dirname = this.root + '/public'

    return [
      dirname,
      // 'git status',
      // `git checkout ${branch}`,
      // `git add _articles static deploy.js README.org _draft favicon.ico`, // TODO: here will be contain deploy.js
      `git add ${files}`, // TODO: here will be contain deploy.js
      ['git', 'commit', '-m', comment],
      `git push origin ${branch}:${branch}`
    ]
  }
}

(function() {
  var d = new Deployer
  d.start()
})()
