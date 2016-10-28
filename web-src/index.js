"use strict"

// fuck the IE
// Ensures there will be no 'console is undefined' errors
window.console = window.console || (function(){
  var c = {}; c.log = c.warn = c.debug = c.info = c.error = c.time = c.dir = c.profile = c.clear = c.exception = c.trace = c.assert = function(){};
  return c;
})();

/**
 * Timer
 * interval @param number default:1s
 *
 * return @param function
 * o @param object
 */
function IntervalTimer (interval) {
  var timer, count = 0
  if (!interval) interval = 1000
  return {
    start:function (o) {
      if (isNaN(o.count) && o.count > 0) {
        console.log('[IntervalTimer] The count is invalid. Count: ', o.count)
        return
      }
      timer = setInterval((function () {
        count = count + 1
        if (count > o.count) {
          this.stop()
          if (typeof o.end === 'function') o.end()
        } else {
          if (typeof o.every === 'function') o.every()
        }
      }).bind(this), interval)
    },
    stop: function (){
      clearInterval(timer)
      count = 0
    }
  }
}

function sendTiming (a, b) {
  ga('send', 'timing', 'homepage', a, b)
}
function sendException (msg, fatal) {
  ga('send', 'exception', {
    exDescription: msg,
    exFatal: fatal || false
  })
}

;(function () {
  window.ga=window.ga||function(){(ga.q=ga.q||[]).push(arguments)};ga.l=+new Date;
  ga('create', 'UA-38213594-1', 'auto', {'siteSpeedSampleRate': 100});
  ga(function(tracker) {
    var clientId = tracker.get('clientId')
    console.log('Hi, you have connected with Google successfully.')
    console.log('Your CLIENT ID: ' + clientId)
  });
  !function loadAnalyticsJS () {
    var script = document.createElement('script')
    script.async = true
    // script.src = '/static/libs/analytics.js'
    script.src = '//www.google-analytics.com/analytics.js'
    document.getElementsByTagName('body')[0].appendChild(script)
  }()
})()

;(function (window) {
  var __map = Array.prototype.map
  var __filter = Array.prototype.filter
  var __slice = Array.prototype.slice
  var __forEach = Array.prototype.forEach
  // var __pop = Array.prototype.pop
  var __shift = Array.prototype.shift
  var __closestNodeA = function (dom) {
    if (typeof dom.closest === 'function') {
      return dom.closest('a')
    } else {
      if (dom.tagName === 'A') {
        return dom
      } else if (dom.tagName === 'BODY') {
        return null
      } else{
        return __closestNodeA(dom.parentNode)
      }
    }
  }

  // var parser = new DOMParser()
  var storage = Storage()

  // var SEARCHER = 'https://www.google.com/?gws_rd=ssl#'
  var SEARCHER = 'https://cse.google.com/cse/publicurl?cx=017951989687920165329:0e60irxxe5m&'
  // var isMobile = {
  //   Android: function() {
  //     return navigator.userAgent.match(/Android/i);
  //   },
  //   BlackBerry: function() {
  //     return navigator.userAgent.match(/BlackBerry/i);
  //   },
  //   iOS: function() {
  //     return navigator.userAgent.match(/iPhone|iPad|iPod/i);
  //   },
  //   Opera: function() {
  //     return navigator.userAgent.match(/Opera Mini/i);
  //   },
  //   Windows: function() {
  //     return navigator.userAgent.match(/IEMobile/i);
  //   },
  //   any: function() {
  //     return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
  //   }
  // };
  // console.log(isMobile.any())

  function addEventListener (dom, evt, fn) {
    function __t (evt, fn) {
      window.addEventListener
        ? this.addEventListener(evt, fn, false)
        : (window.attachEvent)
        ? this.attachEvent('on' + evt, fn)
        : this['on' + evt] = fn;
    }
    __t.call(dom, evt, fn)
  }

  function removeEventListener (dom, evt, fn) {
    function __t (evt, fn) {
      window.removeEventListener
        ? this.removeEventListener(evt, fn, false)
        : (window.detachEvent)
        ? this.detachEvent('on' + evt, fn)
        : null;
    }
    __t.call(dom, evt, fn || function () {})
  }


  // Router Interface
  function Router (routes) {
    var _router
    function compile (r) {
      if (r) {

      } else {
        _router = Object.keys(routes).map(function (r) {
          return {
            test: new RegExp(r, 'i'),
            cb: routes[r]
          }
        })
      }
    }

    compile()

    return {
      test: function (oldURL) {
        // testing...
        // var previous = oldURL, index
        // if ((index = oldURL.indexOf('#!')) >= 0) {
        //   previous = oldURL.slice(index + 2)
        // }
        var rlts = _router.map(function (r) {
          var hash = location.hash.slice(2)
          if (r.test.test(hash)) {
            console.log('[Router] Hited the target: ' + r.test.toString() + '. Go, Go, Go!')
            r.cb.apply(r, [].concat(r.test.exec(hash).slice(1), [oldURL]))
            ga('set', 'page', hash)
            ga('send', 'pageview')
            return true
          }
          return false
        })
        if (rlts.indexOf(true) < 0) console.log('[Router] Error: cannot find the target: ' + location.hash + '.')
      }
    }
  }

  // toggle the stage
  function Stage () {

    var cache = {}
    var specialNav = ['about', 'rss', 'works', 'friends']
    var head = document.querySelector('head')
    var title = head.querySelector('title')
    var body = document.querySelector('body')
    var nav = document.querySelector('nav')

    var goTips = GoTips(body)

    var playArea = document.querySelector('#play-area')
    var playAreaTips = document.createElement('div')
    playAreaTips.className = 'play-area-tips'
    playArea.appendChild(playAreaTips)

    var btnReturn = document.createElement('a')
    // btnReturn.innerHTML = 'Return'
    btnReturn.onclick = function (e) {
      e.preventDefault()
      location.href = '#!/home'
    }
    btnReturn.style.display = 'none'
    body.appendChild(btnReturn)

    var banner = showBanner(body, nav)

    var Animate = {
      "show-banner": function () {
        nav.className="bounceIn animated"
        banner.className="bounceIn animated"
      },
      "hide-banner": function () {
        nav.className="bounceOut animated"
        banner.className="bounceOut animated"
      },
      "show-article": function () {
        playArea.style.backgroundColor = '#fafafa'
        playArea.style.display = "block"
        btnReturn.style.display = "block"
        playArea.className = 'bounceInUp animated'
        btnReturn.className = 'return bounceInUp animated'
      },
      "hide-article": function () {
        playArea.style.backgroundColor = ''
        playArea.className = 'bounceOutDown animated'
        btnReturn.className = 'return bounceOutDown animated'
      }
    }

    var __interface = {

      /**
       * init handler
       */
      init: function (ready) {
        // load archive (articles list)
        console.log('[Stage] Initializing...')

        addEventListener(nav, 'click', (function (e) {
          var target = __closestNodeA(e.target)
          var id = target ? target.id : null
          if (specialNav.indexOf(id) >= 0) {
            e.preventDefault()
            this.go(target.href)
          }
        }).bind(this))
        addEventListener(playArea, 'click', (function (e) {
          var target = e.target
          if (target.className === 'title'
              && target.nodeName === 'A'
              && target.href) {
            e.preventDefault()
            this.go(target.href)
          }
        }).bind(this))

        ClickLambda(banner.querySelector('.lambda')).start()

        console.log('[Stage] Initialized finished. Call function::ready...')
        if (typeof ready === 'function') ready()
        console.log('[Stage] Function::ready done.')

        if (window.performance) {
          __timing.inited = performance.now()
          __forEach.call(Object.keys(__timing), function (type) {
            setTimeout(function () {
              sendTiming(type, __timing[type])
            }, 1000)
          })
        }

        // load static tools
        // loadAnalyticsJS()
        // setTimeout(loadAnalyticsJS, 2000)
        // loadCustomSearch(body)
      },

      /**
       * play area show handler
       * drama dispatcher
       */
      show: function (drama) {
        // clear the play area
        var params = __slice.call(arguments, 1)
        __forEach.call(playArea.children, function (player) {
          player.style.display = 'none'
        })
        console.log('[Stage] Now, the drama is ' + drama)
        // hide others
        Animate["hide-banner"]()
        // show playAreas
        Animate["show-article"]()
        // change body backgroundcolor
        body.style.background = '#fafafa'

        playAreaTips.innerHTML = 'Preparing Drama - ' + '<span style="color:#4285f4;">' + drama + '...</span>'
        playAreaTips.style.display = 'block'
        head.querySelector('title').innerHTML = 'C-Tone | ' + drama.slice(0,1).toUpperCase() + drama.slice(1)

        var startTime = (new Date()).getTime()
        function curtainCall (_dom) {
          var endTime = (new Date()).getTime()
          _dom.style.display = 'block'
          playAreaTips.style.display = 'none'
          if (!__timing[drama]) {
            __timing[drama] = endTime - startTime
            sendTiming(drama, __timing[drama])
          }
        }

        try {

          var dom = this[drama].apply(this, [curtainCall].concat(params))

          if (dom instanceof Element) {
            curtainCall(dom)
          }
        } catch (err) {
          // var endTime = (new Date()).getTime()
          // __timing[drama] = endTime - startTime

          playAreaTips.innerHTML = 'Drama - ' + '<span style="color:#4285f4;">' + drama + '</span>'
            + ' happend error: <strong>' + err.message + '</strong>'
          console.log('[Stage] when show the area: \n', err)
          sendException('[Stage] Show: ' + err.message)
          // sendTiming(drama+'-failed', __timing[drama])
        }
      },

      /**
       * play area hide handler
       */
      hide: function () {
        playAreaTips.style.display = 'none'
        // change body backgroundcolor
        body.style.background = ''

        head.querySelector('title').innerHTML = 'C-Tone Homepage'

        // show others
        Animate["show-banner"]()

        // hide playAreas
        Animate["hide-article"]()

        setTimeout(function () {
          playArea.style.display = "none"
          btnReturn.style.display = "none"
        }, 1000)
      },

      /**
       * show article list
       */
      archive: function (cb) {
        // show archive-list
        var articleListDOM = playArea.querySelector('.article-list')
        if (articleListDOM === null) {
          loadStaticFile('/static/html/archive.html', function (txt) {
            var htmlDoc = document.createElement('div')
            htmlDoc.innerHTML = txt
            // var htmlDoc = parser.parseFromString(txt, "text/html")
            var articleList = htmlDoc.querySelector('.article-list')
            var specialList = htmlDoc.querySelector('.special-list')

            // var articleList = cache.articleList
            articleListDOM = playArea.appendChild(articleList)
            articleList.addEventListener('click', function (ev) {
              var target = ev.target
              var tagName = target.tagName
              var className = target.className
              var href = target.getAttribute('href')
              if (tagName === 'A' && className === 'tag-item' && typeof href !== undefined) {
                ev.preventDefault()
                // location.href = href.replace(/\/search\?/, SEARCHER) + '&hl=en'
                // + '+site:' + location.host
                location.href = '#!/tags?tag=' + href.replace(/\/search\?q=/, '')
              }
            }, false)

            cb(articleListDOM)
          })
        }
        return articleListDOM
      },

      /**
       * show google custom search engine
       */
      search: function (cb) {
        var customSearchDOM = playArea.querySelector('#custom-search')
        if (customSearchDOM === null){
          loadCustomSearch(playArea, function (elt) {
            cb(elt)
          })
        }
        return customSearchDOM
      },

      /**
       * show tages page
       */
      tags: function (cb, tag) {
        var tagsDOM = playArea.querySelector('#tags-cloud')
        var _cb = (function (dom) {
          showPostsByTag(tagsDOM, tag)
          cb(dom)
        }).bind(this)

        if (tagsDOM === null) {
          loadStaticFile('/static/html/tags.html', function (txt) {
            tagsDOM = playArea.appendChild(document.createElement('div'))
            tagsDOM.innerHTML = txt
            tagsDOM.id = 'tags-cloud'

            _cb(tagsDOM)
          })
        } else {
          _cb(tagsDOM)
        }
      },

      /**
       * show some urls about me
       */
      me: function (cb, me) {
        var tableDOM = document.querySelector('#links-table')
        if (tableDOM === null) {
          var links = __map.call(Object.keys(me), function (key) {
            return '<tr><td>'+ key +'</td><td><a href="#!/go?name='+key+'">'+ me[key] +'</a></td></tr>'
          }).join('')
          tableDOM = playArea.appendChild(document.createElement('div'))
          tableDOM.id = 'links-table'
          tableDOM.innerHTML = '<table><caption><a href="/static/about.html">About</a> me</caption>'
            + '<thead><tr><th>Name</th><th>Link</th></tr></thead><tbody>'+links+'</tbody></table>'

          cb(tableDOM)
        }
        return tableDOM
      },

      question: function (cb) {
        var qDOM = document.querySelector('#question')
        var dom = document.createElement('div')
        if (storage && storage.get('answer')) {
          // true
          dom.id = 'question'
          dom.innerHTML = '<div style="margin-top: 20%;font-weight: 600;">'
            +'<p style="font-size: 26px;">&#127881;Congratulation&#127881;</p>'
            +'<p style="font-size: inherit;">There is no exam now :)</p>'
            +'<p style="font-size: inherit;">Please wait...</p></div>'
          qDOM = playArea.appendChild(dom)
        } else {
          // false
          if (qDOM === null) {
            var prefix = '/static/questions/'
            var id = 1
            function sendAnswer(label) {
              ga('send', 'event', 'Question:'+id, 'answer', label)
            }

            loadStaticFile(prefix+id+'.html', (function (content) {
              dom.innerHTML = content
              var form = dom.querySelector('form')
              var nextElement = form.nextElementSibling
              var worker = new Worker(prefix+id+'.js')
              var answerElement = form.elements.answer
              var submitElement = form.elements.submit

              function toggleSubmit() {
                var status = answerElement.disabled
                answerElement.disabled = status ? false : true
                submitElement.disabled = status ? false : true
                submitElement.innerHTML = status ? 'Submit' : 'Calculating...'
              }

              worker.onmessage = function (oEvent) {
                if (oEvent.data.result === true) {
                  // answer right
                  storage.set('answer', true)
                  location.href = '#!/home'
                  sendAnswer('true')
                } else {
                  nextElement.innerHTML = '<strong style="color:#ED462F;">Oops! Wrong.</strong>'
                  storage.set('answer', false)
                  sendAnswer('false:'+oEvent.data.answer)
                }
                toggleSubmit()
              }
              worker.onerror = function (e) {
                nextElement.innerHTML =
                  '<strong style="color:#ED462F;font-size: 20px;">I am crashed because of your browser. XD</strong>'
                console.log('[Question] Worker: ' + e.message)
                sendException('[Question] Worker:' + e.message)
              }
              addEventListener(answerElement, 'input', function () {
                nextElement.innerHTML = '<span>&#128565;</span>'
              })
              form.onsubmit = function (e) {
                e.preventDefault()
                toggleSubmit()
                worker.postMessage({
                  answer: answerElement.value
                })
              }
              qDOM = playArea.appendChild(dom.firstChild)

              cb(qDOM)
            }).bind(this))
          }
        }

        return qDOM
      },

      /**
       * handle the direct url
       */
      go: function (url, previous) {
        if (url) {
          goTips('<p>You will go to</p><p><strong>' + url + '</strong></p>',
                 {timeout: 60, action: 'timeout'})

          var parser = document.createElement('a')
          parser.href = url
          if (parser.hostname && parser.hostname !== location.hostname) {
            ga('send', 'event', 'Outbound Link', 'click', url, {
              transport: 'beacon'
            })
          }

          location.href = url
          // setTimeout(function () {location.href = url;}, 24)
        } else {
          goTips('<p>I don\'t know where to go.</p>')
        }
      },

      /**
       * eggshell :)
       */
      eggshell: function () {
        var lambda = document.querySelector('#banner-wrapper a')
        lambda.href = 'javascript: void(0)'
        lambda.style.cursor = 'default'
        changeOctoCat(body)
      }
    }

    return __interface
  }

  function makeId(len) {
    if (isNaN(parseInt(len))) len = 8;
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < len; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }

  function ClickLambda (lambdaElt) {
    var elt
    var count = 0
    var threshold = +(Math.random()*100%12+4).toFixed(0)
    var startColor = '0,0,0'
    var endColor = '53,122,232'
    var colors = []
    elt = lambdaElt.appendChild(document.createElement('span'))
    var style = elt.style
    style.position = 'absolute', style.fontSize = '0.5em', elt.setAttribute('data-origin-color', style.color)

    !function (startColor, endColor, step, colors) {
      var sc = startColor.split(',').map(function (c) {return +c;})
      var ec = endColor.split(',').map(function (c) {return +c;})
      var sR = +((ec[0] - sc[0]) / step).toFixed(0),
          sG = +((ec[1] - sc[1]) / step).toFixed(0),
          sB = +((ec[2] - sc[2]) / step).toFixed(0)
      for (var i = 0; i < step; i++) {
        colors.push('rgba(' + [sR*i+sc[0], sG*i+sc[1], sB*i+sc[2]].join(',') + ', 0.8)')
      }
    }(startColor, endColor, threshold, colors)

    function animate (lambdaElt, numberElt, count, color) {
      numberElt.innerHTML = count
      numberElt.style.color = color
      lambdaElt.style.color = color
    }

    function __click (e) {
      e.preventDefault()
      if (count < threshold) {
        count += 1
        animate(this, elt, count, count < colors.length ? colors[count] : colors[colors.length - 1])
      } else {
        location.href='#!/answer'
        __interface.stop()
      }
    }

    var __interface = {
      start: function () {
        // removeEventListener(lambdaElt, 'click')
        addEventListener(lambdaElt, 'click', __click)
      },
      stop: function () {
        removeEventListener(lambdaElt, 'click', __click)
        __interface.clear()
      },
      clear: function () {
        animate(lambdaElt, elt, count, elt.getAttribute('data-origin-color'))
        ga('send', 'event', 'Lambda', 'click', count)
        count = 0
      }
    }
    return __interface
  }

  /**
   * Go Tips
   * body @param Element
   *
   * return @param function
   * message @param string
   * _o @param object
   *  + timeout number > 1
   *  + action string
   *  + end object
   */
  function GoTips (body) {
    var goDOM = body.querySelector('#go-tips')
    var msgDOM = goDOM.children[0]
    var timeoutDOM = goDOM.children[1]
    var toolsDOM = goDOM.children[2]
    var closeDOM = goDOM.children[3]
    var intervalTimer = IntervalTimer(1000)

    addEventListener(closeDOM, 'click', function (e) {
      e.preventDefault()
      intervalTimer.stop()
      goDOM.style.display = 'none'
    })

    return function (message, _o) {
      var opt = _o || {}
      var timeout = opt.timeout || 3
      var action = opt.action || 'disappear'
      goDOM.style.display = 'block'
      msgDOM.innerHTML = message
      timeoutDOM.innerHTML = timeout + 's...'
      toolsDOM.querySelector('.reload').style.display = 'none'

      intervalTimer.start({
        every: function () {
          timeout = timeout - 1
          timeoutDOM.innerHTML = timeout + 's...'
        },
        end:function () {
          switch (action) {
          case "timeout":
            toolsDOM.querySelector('.reload').style.display = 'block'
            break
          case "disappear":
          default:
            goDOM.style.display = 'none'
            if(typeof opt.end === 'function') opt.end()
            break
          }
        },
        count: timeout
      })
    }
  }

  /**
   * Show posts by tag-name
   */
  function showPostsByTag(tagsDOM, tag) {
    if (tagsDOM && tagsDOM.children && tag) {
      var children = tagsDOM.children[1].children
      var c = 'tag-' + tag
      __forEach.call(children, function (ul) {
        if (ul.className === c) {
          ul.style.display = 'block'
        } else if (ul.style.display === 'block') {
          ul.style.display = 'none'
        }
      })

      ga('send', 'event', 'Tags', 'click', tag)

      setTimeout(function () {
        window.scrollTo(0, tagsDOM.children[0].getBoundingClientRect().height)
      }, 300)
    }
  }

  /**
   * Read and Write Cookie
   * Perfermance?
   */
  // function readCookie (name) {
  //   var _cookies = document.cookie.split(';').map(function (entry) {
  //     var a = entry.split('=')
  //     return {
  //       name: a[0].replace(/^\s+|\s+$/mg, ""),
  //       value: a[1]
  //     }
  //   })
  //   if (name === undefined) {
  //     return _cookies
  //   } else {
  //     return _cookies.filter(function (c) {
  //       if (c.name === name) return true
  //       else return false
  //     })
  //   }
  // }
  // function writeCookie (name, value, exdays) {
  //   var d = new Date()
  //   d.setTime(d.getTime() + exdays * 86400000) // default 1d
  //   var expirs = 'expires='+d.toUTCString()
  //   document.cookie = name.replace(/^\s+|\s+$/mg, "")+'='+value+';'+expirs+';path=/'
  // }
  function Storage () {
    return {
      get: function (name) {
        var value = localStorage.getItem(name)
        try {
          return JSON.parse(value)
        } catch (err) {
          sendException('[Storage] Get:' + err.message)
          return value
        }
      },
      set: function (name, value) {
        if (typeof value === 'object') {
          value = JSON.stringify(value)
        }
        localStorage.setItem(name, value)
      }
    }
  }

  /**
   * load the image of the octocat
   * find octocat and then load the image of the specify octocat
   */
  function loadOctocat (body, oBannerWrapper, octocat) {

    var startTime = (new Date()).getTime()
    var title = octocat.t
    var filename = octocat.f
    var src = 'https://octodex.github.com/images/' + filename
    var img = document.createElement('img')
    img.style.display = 'none'
    img.onload = function () {
      var endTime = (new Date()).getTime()
      __timing.octocat = endTime - startTime

      // oBannerWrapper.style.background = 'url('+ src +') no-repeat top center fixed';
      // oBannerWrapper.style.backgroundSize = '424px 424px';
      oBannerWrapper.style.textAlign = 'center';
      oBannerWrapper.innerHTML = '<img src="'+src+'" alt="'+title+'" '
      // + 'style="width:' + oBannerWrapper.querySelector('.blink-wrapper').getBoundingClientRect().height +'px"'
        + '/>'
        + '<p><a href="https://github.com/" alt="Check me out on :octocat:" title="Check me out on :octocat:">'
        + title + '</a></p>';
      clearInterval(window.blinkTimer)

      sendTiming('octocat', __timing.octocat)
    };
    img.onerror = function () {
      // var endTime = (new Date()).getTime()
      // __timing.octocat = endTime - startTime

      oBannerWrapper.children[1].innerHTML = 'Octocat may be taken by aliens. Sad :('
      console.log('[Octocat] Load the image of octocat failed!')
      clearInterval(window.blinkTimer)

      sendException('[Octocat] Load: Display the image of octocat failed.')
      // sendTiming('octocat-failed', __timing.octocat)
    };
    body.appendChild(img)
    img.src = src;
  }

  /**
   * change the image of the octocat (load the image to the local cache)
   * fisrt, check the local storage
   * if no, load from remote
   */
  function changeOctoCat (body) {
    var oBannerWrapper = document.getElementById('banner-wrapper')
    var hitElement = oBannerWrapper.children[1]
    hitElement.style.display = 'block'
    hitElement.className = 'blink'
    hitElement.setAttribute('data-frequency', 700)

    blink()

    var saveOctocat

    if (storage && typeof storage.get === 'function')
      saveOctocat = storage.get('octocat')

    if (saveOctocat) {

      loadOctocat(body, oBannerWrapper, saveOctocat)

    } else {

      var startTime = (new Date()).getTime()
      var s = document.createElement('script')
      s.async = true
      s.onload = function () {
        var endTime = (new Date()).getTime()
        __timing.octodex = endTime - startTime
        // select octocat from remote DB File
        hitElement.className = ''
        var octodex = window.octodex;
        if (!octodex) {
          hitElement.innerHTML = 'I cannot load the octodex db.'
          return
        }
        var max = octodex.length;
        var octocat = octodex[Math.round(Math.random(max) * 10000 % max)];

        // load failed: if not find octocat
        if (!octocat) {
          hitElement.innerHTML = 'Now, I want to load ', octocat, '. But failed!'
          return
        } else {
          // save the octocat
          storage.set('octocat', octocat)
        }
        loadOctocat(body, oBannerWrapper, octocat)
        sendTiming('octodex', __timing.octodex)
      }
      s.onerror = function () {
        // var endTime = (new Date()).getTime()
        // __timing.octodex = endTime - startTime
        // sendTiming('octodex-failed', __timing.octodex)
        sendException('[Octodex] Load: Get the octodex file failed.')
      }
      body.appendChild(s)
      s.src = '/static/octodex-data.js'
    }
  }

  /**
   * blink the element
   */
  function blink () {
    __forEach.call(document.getElementsByClassName('blink'), function (blink) {
      var frequency = parseInt(blink.getAttribute('data-frequency'), 10)
      // blink.style.display = 'initial'
      if (frequency > 0)
        window.blinkTimer = setInterval(function(_blink) {
          if (_blink.style.visibility === '' ||
              _blink.style.visibility === 'visible') {
            // hide
            _blink.style.visibility = 'hidden'
          } else {
            // show
            _blink.style.visibility = 'visible'
          }
        }, frequency, blink);
    });
  }

  /**
   * show Banner
   */
  function showBanner (body, content) {
    // blink()
    // changeOctoCat(body);
    return document.querySelector('#banner-wrapper')
  }

  // ==============================================================================
  // Loader
  /**
   * Just support method:GET
   */
  function loader(o) {
    var httpRequest = new XMLHttpRequest()
    if (!httpRequest) {
      console.error('[Loader] Giving up :( Cannot create an XMLHTTP instance');
      return false;
    }
    httpRequest.onreadystatechange = function () {
      try {
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
          if (httpRequest.status === 200) {
            if (typeof o.success === 'function') o.success(httpRequest.responseText)
          } else {
            if (typeof o.fail === 'function') o.fail(httpRequest)
          }
        }
      }
      catch( e ) {
        if (typeof o.error === 'function') o.error(httpRequest, e)
        console.error(e)
        sendException('[HTTP Request] Readystatechange: ' + e.message)
        throw e
      }
    }
    httpRequest.open(o.type, o.url)
    httpRequest.send()
  }

  function loadStaticFile(url, callback) {
    loader({
      type: 'GET',
      url: url,
      success: callback
    })
  }
  // ==============================================================================

  function createNavDom (o) {
    var a = document.createElement('a')
    a.title = o.title
    a.href = o.href
    a.innerHTML = o.text
    a.id = o.id
    a.onclick = o.onclick
    return a
  }

  // ==============================================================================
  // Load external resources
  // https://developers.google.com/custom-search/docs/element
  function loadCustomSearch (elt, callback) {
    var div = document.createElement('div');
    div.id = 'custom-search'
    div.innerHTML = '<gcse:search></gcse:search>'
    elt.appendChild(div)

    window.__gcse = {
      parsetags: 'explicit',
      callback: function () {
        console.log('[GCSE] Google Custom Search Engine Loaded Over.')
        google.search.cse.element.render({
          div: "custom-search",
          tag: 'search'
        })
        if (typeof callback === 'function') callback(div)
      }
    }

    var cx = '017951989687920165329:0e60irxxe5m';
    var gcse = document.createElement('script');
    var s = document.getElementsByTagName('script')[0];
    gcse.type = 'text/javascript';
    gcse.async = true;
    s.parentNode.insertBefore(gcse, s);
    gcse.src = 'https://cse.google.com/cse.js?cx=' + cx;
  }
  // ==============================================================================

  // window.onpopstate = function () {
  //   var currentState = history.state
  //   debugger
  //   console.log(currentState)
  //   if (currentState) {
  //     if (window.console && window.console.info) {
  //       console.info('navigator back: ' + currentState.url)
  //     }
  //     // pjax({url:currentState.url, tag: 'Go'})
  //   } else {
  //     // render(pageCache['/'])
  //   }
  // }

  function main () {

    var stage = Stage()

    var me = {
      "douban": 'https://www.douban.com/people/creamidea/',
      "github": 'https://github.com/creamidea',
      "zhihu": 'https://www.zhihu.com/people/nekotrek',
      "twitter": 'https://twitter.com/creamidea',
      "facebook": 'https://www.facebook.com/creamidea',
      "google-plus": 'https://plus.google.com/u/0/106145678677607887880',
      "about": 'https://about.me/ice.cream',
      "flickr": 'https://www.flickr.com/people/85376793@N04/',
      "xiami": 'http://www.xiami.com/u/10429952'
    }

    var router = Router({
      "^/?$|^/home$": function () {
        if (storage && storage.get('answer') === true) {
          stage.eggshell()
        }
        stage.hide()
      },
      "^/archive$": function () {
        stage.show('archive')
      },
      "^/wiki/(\.+)": function (file) {
        var url = '/static/html/wiki/' + file
        history.pushState({}, '', url)
        stage.go(url)
      },
      "^/articles/(\.+)": function (file) {
        var url = '/static/html/articles/' + file
        stage.go(url)
      },
      "^/search$": function () {
        stage.show('search')
      },
      "^/tags(?:\\?tag=(\.+))?": function (tag) {
        stage.show('tags', tag)
      },
      "^/me$": function () {
        stage.show('me', me)
      },
      "^/go(?:\\?name=(\.+))": function (name, previous) {
        var url
        try {
          url = me[name]
        } catch (err) {
          console.log('[Go] Don\'t know where to go. \n', err)
        }
        stage.go(url, previous)
      },
      "^/answer$": function (previous) {
        if (previous && window.Worker) {
          var a = document.createElement('a')
          a.href = previous
          if (a.hash === '')
            stage.show('question')
        }
      }
    })

    stage.init(function () {
      router.test()
      addEventListener(window, 'hashchange', function (e) {
        // console.log('from: ' + e.oldURL)
        router.test(e.oldURL)
      })
    })

  }

  function hateYou () {
    var hit = document.createElement('div')
    hit.innerHTML = '<p>Oops! Your browser is too outmoded. '
      + 'Would you please try the lastest <a href="https://www.google.com/chrome/">Chrome</a>?</p>'
      + '<p>Or you can go <a href="https://github.com/creamidea/creamidea.github.com/tree/master/_content">here</a> or <a href="https://github.com/creamidea/creamidea.github.com/tree/master/_draft">here</a></p>'
    hit.style.textAlign = 'center'
    document.getElementsByTagName('body')[0].appendChild(hit)
  }

  // Start....
  !function () {
    window.__timing = {}
    if (window.performance) {
      __timing.start = performance.now()
    }

    var running = false
    var loadEvent = ['DOMContentLoaded', 'load']
    for (var i = 0, max = loadEvent.length; i < max; i++) {
      var event = loadEvent[i]
      !function (event) {

        addEventListener(window, event, function () {
          if (window.performance) {
            __timing[event] = performance.now()
          }
          if (event === 'load') {
            sendTiming('load', __timing.load)
          }
          if (!running) {
            running = true
            if (typeof __forEach === 'undefined') {
              // too old
              hateYou()
            } else {
              main()
              // main.apply(window)
            }
            // document.getElementById('search').style.display = 'initial!important'
            // removeEventListener(window, event)
          }
        }, false)

      }(event)
    }
  }()

})(this)
