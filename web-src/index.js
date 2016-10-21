"use strict"

// fuck the IE
//Ensures there will be no 'console is undefined' errors
window.console = window.console || (function(){
  var c = {}; c.log = c.warn = c.debug = c.info = c.error = c.time = c.dir = c.profile = c.clear = c.exception = c.trace = c.assert = function(){};
  return c;
})();

;(function (window) {
  var __map = Array.prototype.map
  var __slice = Array.prototype.slice
  var __forEach = Array.prototype.forEach
  // var __pop = Array.prototype.pop
  var __shift = Array.prototype.shift
  // var parser = new DOMParser()
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
    __t.call(dom, evt, fn)
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
      test: function () {
        // testing...
        var rlts = _router.map(function (r) {
          if (r.test.test(location.hash)) {
            console.log('Router hited the target: ' + r.test.toString() + '. Go, Go, Go!')
            r.cb.apply(r, r.test.exec(location.hash).slice(1))
            return true
          }
          return false
        })
        if (rlts.indexOf(true) < 0) console.log('Router cannot find the target: ' + location.hash + '.')
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
      init: function (ready) {
        // load archive (articles list)
        console.log('Stage initializing...')
        addEventListener(nav, 'click', (function (e) {
          var target = e.target
          if (specialNav.indexOf(target.id) >= 0 ||
              specialNav.indexOf(target.parentElement.id) >=0) {
            e.preventDefault()
            this.go(target.href || target.parentElement.href)
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
        console.log('Stage initialized finished.\nCall function::ready...')
        if (typeof ready === 'function') ready()
        console.log('Function::ready done.')

        // load static tools
        // loadAnalyticsJS()
        // setTimeout(loadAnalyticsJS, 2000)
        // loadCustomSearch(body)
      },

      show: function (drama) {
        // clear the play area
        var params = __slice.call(arguments, 1)
        __forEach.call(playArea.children, function (player) {
          player.style.display = 'none'
        })
        console.log('Now, the drama is ' + drama)
        // hide others
        Animate["hide-banner"]()
        // show playAreas
        Animate["show-article"]()
        // change body backgroundcolor
        body.style.background = '#fafafa'

        playAreaTips.innerHTML = 'Preparing Drama - ' + '<span style="color:#4285f4;">' + drama + '...</span>'
        playAreaTips.style.display = 'block'
        try {
          var dom = this[drama].apply(this, [function () {
            playAreaTips.style.display = 'none'
          }].concat(params))

          if (dom instanceof Element) {
            dom.style.display = 'block'
            playAreaTips.style.display = 'none'
          }
        } catch (err) {
          playAreaTips.innerHTML = 'Drama - ' + '<span style="color:#4285f4;">' + drama + '</span>'
            + ' happend error: <strong>' + err.message + '</strong>'
          console.log(err)
        }
      },

      hide: function () {
        playAreaTips.style.display = 'none'
        // change body backgroundcolor
        body.style.background = ''

        // show others
        Animate["show-banner"]()

        // hide playAreas
        Animate["hide-article"]()

        setTimeout(function () {
          playArea.style.display = "none"
          btnReturn.style.display = "none"
        }, 1000)
      },

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

            articleListDOM.style.display = 'block'
            cb()
          })
        }
        return articleListDOM
      },

      search: function (cb) {
        var customSearchDOM = playArea.querySelector('#custom-search')
        if (customSearchDOM === null){
          loadCustomSearch(playArea, function (elt) {
            elt.style.display = 'block'
            cb()
          })
        }
        return customSearchDOM
      },

      tags: function (cb, tag) {
        var tagsDOM = playArea.querySelector('#tags-cloud')
        var _cb = (function () {
          tagsDOM.style.display = 'block'
          showPostsByTag(tagsDOM, tag)
          cb()
        }).bind(this)

        if (tagsDOM === null) {
          loadStaticFile('/static/html/tags.html', function (txt) {
            var _t = document.createElement('div')
            _t.innerHTML = txt
            _t.id = 'tags-cloud'
            tagsDOM = playArea.appendChild(_t)
            _cb()
          })
        } else {
          _cb()
        }
      },

      go: function (url) {
        if (url) {
          goTips('<p>You will go to</p><p><strong>' + url + '</strong></p>',
                 {timeout: 60, action: 'timeout'})
          setTimeout(function () {location.href = url}, 24)
        } else {
          goTips('<p>I don\'t know where to go.</p>')
        }
      }

    }
    return __interface
  }

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
      setTimeout(function () {
        window.scrollTo(0, tagsDOM.children[0].getBoundingClientRect().height)
      }, 300)
    }
  }

  /**
   * 变换首页octocat图片 本地预处理(提前加载到本地缓存中)
   */
  function changeOctoCat (body) {
    var s = document.createElement('script');
    s.async = true
    s.src = '/static/octodex-data.js';
    s.onload = function () {
      var octodex = window.octodex;
      if (!octodex) return;
      var max = octodex.length;
      var octocat = octodex[Math.round(Math.random(max) * 10000 % max)];
      if (!octocat.src) {
        console.log('Now, I want to load ', octocat, '. But failed!');
        return;
      }
      var src = 'https://octodex.github.com' + octocat.src;
      var img = document.createElement('img');
      img.style.display = 'none';
      img.onload = function () {
        var oBannerWrapper = document.getElementById('banner-wrapper');
        if (!oBannerWrapper) return
        // oBannerWrapper.style.background = 'url('+ src +') no-repeat top center fixed';
        // oBannerWrapper.style.backgroundSize = '424px 424px';
        oBannerWrapper.style.textAlign = 'center';
        oBannerWrapper.innerHTML = '<img src="'+src+'" alt="'+octocat.title+'"/><p style="display: block;margin:0;bottom:0;left:1%;right:1%;line-height:1;"><a href="https://github.com/" alt="Check me out on :octocat:" title="Check me out on :octocat:" style="color:black;font-size:16px;font-family:Georgia1,Georgia,Times New Roman,Times,serif;font-style: italic;">'+octocat.title+'</a></p>';
        clearInterval(window.blinkTimer);
      };
      img.onerror = function () {
        console.log('Load the image of octocat failed!');
        clearInterval(window.blinkTimer);
      };
      body.appendChild(img);
      img.src = src;
    };
    body.appendChild(s);
  }

  /**
   * 闪烁 >_
   */
  function blink () {
    __forEach.call(document.getElementsByClassName('blink'), function (blink) {
      var oldColor = blink.getAttribute('data-old-color');
      if (!oldColor)
        blink.setAttribute('data-old-color', blink.style.color);
      var frequency = parseInt(blink.getAttribute('data-frequency'), 10);
      if (frequency > 0)
        window.blinkTimer = setInterval(function(_blink, _oldColor) {
          if (!_blink) _blink = blink;
          if (!_oldColor) _oldColor = oldColor;
          if (blink)
            blink.style.color = blink.style.color === 'white' ? oldColor : 'white';
        }, frequency, blink, oldColor);
    });
  }

  /**
   * 增加首页背景图片的容器
   */
  function showBanner (body, content) {
    blink()
    changeOctoCat(body);
    return document.querySelector('#banner-wrapper')
  }

  /**
   * 初始化首页banner图片
   */
  // function initImgWapper (body) {
  //   var div = document.createElement('div');
  //   div.id = 'img-wapper';
  //   body.appendChild(div);
  //   return div;
  // }

  /**
   * Just support method:GET
   */
  function loader(o) {
    var httpRequest = new XMLHttpRequest()
    if (!httpRequest) {
      console.error('Giving up :( Cannot create an XMLHTTP instance');
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

  function createNavDom (o) {
    var a = document.createElement('a')
    a.title = o.title
    a.href = o.href
    a.innerHTML = o.text
    a.id = o.id
    a.onclick = o.onclick
    return a
  }

  function loadAnalyticsJS () {
    var script = document.createElement('script')
    script.async = true
    script.src = '//www.google-analytics.com/analytics.js'
    document.getElementsByTagName('body')[0].appendChild(script)
  }

  function loadCustomSearch (elt, callback) {
    var div = document.createElement('div');
    div.id = 'custom-search'
    div.innerHTML = '<gcse:search></gcse:search>'
    elt.appendChild(div)

    var cx = '017951989687920165329:0e60irxxe5m';
    var gcse = document.createElement('script');
    var s = document.getElementsByTagName('script')[0];
    gcse.type = 'text/javascript';
    gcse.async = true;
    gcse.onload = function () {
      if (typeof callback === 'function') callback(div)
      console.log('Google Custom Search Engine Loaded Over.')
    }
    s.parentNode.insertBefore(gcse, s);
    gcse.src = 'https://cse.google.com/cse.js?cx=' + cx;
  }

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
      "facebook": '',
      "google-plus": 'https://plus.google.com/u/0/106145678677607887880',
      "about": 'https://about.me/ice.cream',
      "flickr": 'https://www.flickr.com/people/85376793@N04/'
    }

    var router = Router({
      "home": function () {
        stage.hide()
      },
      "archive": function () {
        stage.show('archive')
      },
      "wiki/(\.+)": function (file) {
        // var file = __shift.call(arguments)
        var url = '/static/html/wiki/' + file
        history.pushState({}, '', url)
        stage.go(url)
      },
      "articles/(\.+)": function (file) {
        // var file = __shift.call(arguments)
        var url = '/static/html/articles/' + file
        stage.go(url)
      },
      "search": function () {
        stage.show('search')
      },
      "tags(?:\\?tag=(\.+))?": function (tag) {
        stage.show('tags', tag)
      },
      "go(?:\\?name=(\.+))": function (name) {
        var url
        try {
          url = me[name]
        } catch (err) {
          console.log('Don\'t know where to go. \n', err)
        }
        stage.go(url)
      }
    })

    stage.init(function () {
      router.test()
    })
    window.onhashchange = function () {
      router.test()
    }

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
    var running = false
    var loadEvent = ['DOMContentLoaded', 'load']
    for (var i = 0, max = loadEvent.length; i < max; i++) {
      var event = loadEvent[i]
      addEventListener(window, event, function () {
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
          removeEventListener(window, event, function () {})
        }
      }, false)
    }
  }()

})(this)
