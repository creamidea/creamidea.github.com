"use strict"

var __map = Array.prototype.map
var __forEach = Array.prototype.forEach
// var __pop = Array.prototype.pop
var __shift = Array.prototype.shift
var parser = new DOMParser()
// var SEARCHER = 'https://www.google.com/?gws_rd=ssl#'
var SEARCHER = 'https://cse.google.com/cse/publicurl?cx=017951989687920165329:0e60irxxe5m&'
var SVG = {
  'archive':'<svg version="1.0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64.000000 64.000000"><g transform="translate(0.000000,64.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none"><path d="M24 606 c-3 -7 -4 -40 -2 -72 l3 -59 289 -3 c225 -2 291 1 298 10 12 20 9 113 -4 126 -19 19 -577 17 -584 -2z"/><path d="M44 427 c-2 -7 -3 -100 -2 -207 l3 -195 270 0 270 0 3 208 2 207 -270 0 c-211 0 -272 -3 -276 -13z"/></g></svg><span>Archive</span>',
  'works': '<svg version="1.0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64.000000 64.000000"><g transform="translate(0.000000,64.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none"><path d="M482 628 c-7 -7 -12 -37 -12 -68 l0 -55 -115 -115 c-109 -108 -114 -115 -98 -132 16 -18 22 -14 132 96 l116 115 59 3 c43 2 62 8 70 20 9 15 0 28 -54 83 -67 67 -78 73 -98 53z"/><path d="M77 281 c-86 -88 -90 -103 -64 -205 13 -48 15 -50 63 -63 102 -26 117 -22 205 64 l79 77 -37 38 c-20 21 -41 38 -46 38 -4 0 -29 -14 -53 -31 -25 -17 -48 -29 -51 -26 -3 3 9 26 26 51 17 24 31 49 31 53 0 5 -17 26 -38 46 l-38 37 -77 -79z"/></g></svg><span>Works</span>',
  'friends': '<svg version="1.0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64.000000 64.000000"><g transform="translate(0.000000,64.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none"><path d="M212 624 c-32 -22 -30 -76 3 -102 l25 -20 -31 -12 c-45 -19 -80 -71 -81 -119 -1 -66 22 -107 55 -102 4 0 7 -34 7 -77 l0 -77 -36 -23 c-45 -29 -43 -58 4 -56 23 2 33 -3 38 -18 4 -13 13 -18 27 -16 18 2 23 11 25 46 2 23 7 42 11 42 4 0 20 11 35 25 26 24 26 25 26 170 l0 145 40 0 c51 0 100 24 100 49 0 25 -21 32 -45 15 -24 -18 -93 -17 -125 1 -22 12 -23 14 -7 20 10 4 24 19 32 34 10 18 14 21 15 9 0 -9 11 -26 25 -36 23 -18 24 -21 8 -25 -12 -3 -8 -5 10 -6 15 0 27 3 27 8 0 5 9 12 19 16 10 3 24 19 31 36 11 27 10 34 -7 57 -11 15 -30 28 -42 30 -28 4 -71 -23 -71 -46 0 -12 -7 -8 -26 16 -28 35 -57 41 -92 16z"/><path d="M443 441 c-12 -10 -43 -22 -68 -25 l-45 -7 0 -200 c0 -169 2 -201 15 -205 8 -4 22 -1 30 6 12 10 18 10 30 0 8 -7 22 -10 30 -6 12 4 15 29 15 136 0 119 2 131 17 128 22 -4 53 54 53 97 0 30 -33 95 -47 95 -5 -1 -18 -9 -30 -19z"/></g></svg><span>Friends</span>'
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
  var head = document.querySelector('head')
  var title = head.querySelector('title')
  var body = document.querySelector('body')
  var nav = document.querySelector('nav')
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
      playArea.style.display = "block"
      btnReturn.style.display = "block"
      playArea.className = 'bounceInUp animated'
      btnReturn.className = 'return bounceInUp animated'
    },
    "hide-article": function () {
      playArea.className = 'bounceOutDown animated'
      btnReturn.className = 'return bounceOutDown animated'
    }
  }

  var __interface = {
    init: function (ready) {
      // load archive (articles list)
      console.log('Stage initializing...')
      loadArchive(body, function (articleList, specialList) {
        cache.articleList = articleList
        var archive = nav.appendChild(createNavDom({
          text: SVG['archive'], href: '#!/archive', id: 'archive', title: 'Archive'
        }))

        __map.call(specialList.children, function (item) {
          var t = item.querySelector('.title')
          var name = t.innerHTML
          if (['friends', 'works'].indexOf(name.toLowerCase()) >= 0) {
            nav.appendChild(createNavDom({
              // href:'#!'+t.getAttribute('href'),
              href: t.getAttribute('href'),
              text: SVG[name.toLowerCase()],
              id: name.toLowerCase(),
              title: name
            }))
          }
        })

        console.log('Stage initialized finished.\nCall function::ready...')
        if (typeof ready === 'function') ready()
        console.log('Function::ready done.')

        // load static tools
        loadAnalyticsJS()
        // loadCustomSearch(body)
      })
    },
    show: function (drama) {
      // clear the play area
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

      playAreaTips.innerHTML = 'Preparing Drama - ' + '<span style="color:#4285f4;">' + drama + '</span>'
      playAreaTips.style.display = 'block'
      try {
        this[drama](function () {
          playAreaTips.style.display = 'none'
        })
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
        var articleList = cache.articleList
        articleListDOM = playArea.appendChild(articleList)
        articleList.addEventListener('click', function (ev) {
          var target = ev.target
          var tagName = target.tagName
          var className = target.className
          var href = target.getAttribute('href')
          if (tagName === 'A' && className === 'tag-item' && typeof href !== undefined) {
            ev.preventDefault()
            location.href = href.replace(/\/search\?/, SEARCHER)
              // + '+site:' + location.host
          }
        }, false)
      }
      articleListDOM.style.display = 'block'
      cb()
    },
    search: function (cb) {
      var customSearchDOM = playArea.querySelector('#custom-search')
      if (customSearchDOM === null){
        loadCustomSearch(playArea, function (elt) {
          elt.style.display = 'block'
          cb()
        })
      } else {
        customSearchDOM.style.display = 'block'
        cb()
      }
    },
    go: function (url) {
      location.href = url
    }
  }
  return __interface
}

/**
 * 变换首页octocat图片 本地预处理(提前加载到本地缓存中)
 */
function changeOctoCat (body) {
  var s = document.createElement('script');
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
    img.src = src;
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
  var div = document.createElement('div');
  div.id = 'banner-wrapper';
  div.innerHTML = '<p class="blink-wrapper">&gt;<span class="blink" data-frequency="700">_</span></p>';
  body.insertBefore(div, content);
  blink()
  changeOctoCat(body);
  return div
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

function loadArchive (body, callback) {
  loader({
    type: 'GET',
    url: '/static/html/archive.html',
    success: function (txt) {
      var htmlDoc = parser.parseFromString(txt, "text/html")
      callback(
        htmlDoc.querySelector('.article-list'),
        htmlDoc.querySelector('.special-list')
      )
    }
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

window.onload = function () {
  var stage = Stage()
  var router = Router({
    "home": function () {
      stage.hide()
    },
    "archive": function () {
      stage.show('archive')
    },
    "wiki/(\.+)": function () {
      var file = __shift.call(arguments)
      var url = '/static/html/wiki/' + file
      history.pushState({}, '', url)
      stage.go(url)
    },
    "articles/(\.+)": function () {
      var file = __shift.call(arguments)
      var url = '/static/html/articles/' + file
      stage.go(url)
    },
    "search": function () {
      stage.show('search')
    }
  })
  stage.init(function () {
    router.test()
  })
  window.onhashchange = function () {
    router.test()
  }
}
