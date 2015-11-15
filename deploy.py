#!/usr/bin/env python
# -*- coding: utf-8 -*-

import sys
import os
from datetime import datetime


class Deployer(object):
    """docstring for Deployer"""

    def __init__(self, root=None):
        super(Deployer, self).__init__()
        if (not root):
            root = os.path.dirname(os.path.realpath(__file__))
        self.root = root

    def start(self):
        if (len(sys.argv) > 3):
            print 'COMMAND error! The comment must be wrapped by ""'
            print 'e.g. $ node deploy.js "The comment you want to input."'
            exit(0)
        comment = sys.argv[1]
        self.exec_sh(self.push_articles(comment))

        # var A = child_process.fork(this['exec-sh'](this['push-github-master'](comment)))
        # var B =
        # child_process.fork(this['exec-sh'](this['push-github-articles'](comment)))

    def exec_sh(self, sh):
        for cwd in sh:
            if isinstance(cwd, basestring) :
                
            print cwd

        # sh.every(function(cwd) {
        #     if (typeof cwd === 'string' | | cwd instanceof String) {
        #         cwd=cwd.split(' ')
        #     }
        #     console.log(`- > ${cwd.join(' ')}`)
        #     var rlt=spawnSync(cwd.shift(), cwd)
        #     if (rlt.status == = null) {
        #         console.log(`command cannot found: ${rlt.args[0]}`)
        #         process.exit(1)
        #     }
        #     if (rlt.status == = 0) {
        #         // var stdout=rlt.stdout.toString()
        #         // console.log(stdout)
        #         return true
        #     } else {
        #         if (rlt.stderr) console.log(rlt.stderr.toString())
        #         if (rlt.stdout) console.log(rlt.stdout.toString())
        #         return false
        #     }
        # })

    def push_articles(self, comment):
        if (not comment):
            comment = "For Deployment " + datetime.today().strftime("%Y-%m-%d %H:%M:%S")
        branch = 'articles'
        return [
            "cd {root}".format(root=self.root),
            #   `git checkout ${branch}`,
            # TODO: here will be contain deploy.js
            "git add _articles static deploy.js README.org _draft favicon.ico",
            ['git', 'commit', '-m', '"' + comment + '"'],
            "git push origin {branch}:{branch}".format(branch=branch)
        ]

if __name__ == '__main__':
    d = Deployer()
    d.start()


# class Deployer (Object):
#   // branch 分支的名称
#   // dirname 站点（blog）的路径在哪里
#   constructor() {
#     if (!dirname) var dirname = __dirname
#     this.root = dirname
#   }
#
#   start() {
#     // console.log(process.argv)
#     if (process.argv.length > 3) {
#       console.log('COMMAND error! The comment must be wrapped by ""');
#       console.log('e.g. $ node deploy.js "The comment you want to input."');
#       process.exit(0)
#     }
#     var comment = process.argv[2]
#     var A = child_process.fork(this['exec-sh'](this['push-github-master'](comment)))
#     var B = child_process.fork(this['exec-sh'](this['push-github-articles'](comment)))
#   }
#
#   'exec-sh' (sh) {
#     sh.every(function(cwd) {
#       if (typeof cwd === 'string' || cwd instanceof String) {
#         cwd = cwd.split(' ')
#       }
#       console.log(`-> ${cwd.join(' ')}`);
#       var rlt = spawnSync(cwd.shift(), cwd)
#       if (rlt.status === null) {
#         console.log(`command cannot found: ${rlt.args[0]}`)
#         process.exit(1)
#       }
#       if (rlt.status === 0) {
#         // var stdout = rlt.stdout.toString()
#         // console.log(stdout)
#         return true
#       } else {
#         if (rlt.stderr) console.log(rlt.stderr.toString())
#         if (rlt.stdout) console.log(rlt.stdout.toString())
#         return false
#       }
#     })
#   }
#
#   'push-github-articles' (comment) {
#     if (!comment) var comment = "For Deployment " + (new Date())
#     var branch = 'articles'
#     return [
#       `cd ${this.root}`,
#       // `git checkout ${branch}`,
#       `git add _articles static deploy.js README.org _draft favicon.ico`, // TODO: here will be contain deploy.js
#       ['git', 'commit', '-m', `"${comment}"`],
#       `git push origin ${branch}:${branch}`
#     ]
#   }
#
#   'push-github-master' (comment) {
#     if (!comment) var comment = "For Deployment " + (new Date())
#     var branch = 'master'
#     return [
#       `cd ${this.root}/public`,
#       // `git checkout ${branch}`,
#       `git add .`, ['git', 'commit', '-m', `"${comment}"`],
#       `git push origin ${branch}:${branch}`
#     ]
#   }
#
# }
#
# (function() {
#   'use strict'
#   // console.log = function () {}
#   var d = new Deployer
#   d.start()
# })()
