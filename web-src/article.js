'use strict'

// fuck the IE
//Ensures there will be no 'console is undefined' errors
window.console = window.console || (function(){
  var c = {}; c.log = c.warn = c.debug = c.info = c.error = c.time = c.dir = c.profile = c.clear = c.exception = c.trace = c.assert = function(){};
  return c;
})();

/**
 * load disqus
 */
function loadDisqus(body, content) {
  if (content) {
    var div = document.createElement('div');
    div.className = 'comm';
    // div.innerHTML = '<div class="comm_open_btn" comment="copy from bilibili.com :P" onclick="loadDisqusComment(this)"></div>';
    div.innerHTML = '<div comment="copy from bilibili.com :P" onclick="loadDisqusComment(this)">Load Comments</div>'
    content.appendChild(div);
    // setTimeout(loadDisqusComment, 1314);
  }
}
function loadDisqusComment (target) {
  if (target) {
    var parent = target.parentElement;
    parent.style.display = 'none';
  }

  window.disqus_config = function () {
    // 这里是配置disqus地方，具体可以参考
    // https://help.disqus.com/customer/portal/articles/472098-javascript-configuration-variables
    this.page.identifier = location.pathname.split('/').slice(-2).join('/')
  }

  var d = document;
  var s = document.createElement('script');
  s.src = '//creamidea.disqus.com/embed.js';
  s.setAttribute('data-timestamp', +new Date());
  (d.head || d.body).appendChild(s);

  var content = document.getElementById('content');
  var disqus = document.createElement('div');
  disqus.id = 'outline_disqus_thread';
  disqus.className = 'outline-2';
  disqus.style.marginBottom = '44px';
  disqus.innerHTML = '<h2 id="disqus_thread_header">Comments</h2><div id="disqus_thread"><p style="text-align:center;font-family: Georgia1,Georgia,Times New Roman,Times,serif;">Disqus is on the way...</p></div>';
  content.appendChild(disqus);
}

/**
 * load custom search
 */
// function loadCustomSearch (elt, elt2) {
//   var s = document.getElementsByTagName('script')[0]
//   var cx = '017951989687920165329:0e60irxxe5m'
//   var gcse = document.createElement('script')
//   gcse.type = 'text/javascript'
//   gcse.async = true
//   gcse.onload = function () {
//     var div = document.createElement('div')
//     div.id = 'custom-search'
//     div.innerHTML = '<gcse:search></gcse:search>'
//     elt.insertBefore(div, elt2)
//     // console.log('Google Custom Search Engine Loaded Over.')
//   }
//   s.parentNode.insertBefore(gcse, s)
//   gcse.src = 'https://cse.google.com/cse.js?cx=' + cx
// }

;(function (window) {
  var __forEach = Array.prototype.forEach
  var __slice = Array.prototype.slice
  var __filter = Array.prototype.filter
  // var SEARCHER = 'https://www.laiguge.com/search?hl=en&q='
  // var SEARCHER = 'http://0s.o53xo.m5xw6z3mmuxgg33n.erenta.ru/?gws_rd=ssl#hl=en&q='
  // var SEARCHER = 'https://www.google.com/?gws_rd=ssl#hl=en&q='
  var SEARCHER = 'https://cse.google.com/cse/publicurl?cx=017951989687920165329:0e60irxxe5m&hl=en&q='

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

  function elementInViewport(el) {
    var rect = el.getBoundingClientRect()
    return (
      rect.top >= 0
        && rect.left >= 0
        && rect.top <= (window.innerHeight || document.documentElement.clientHeight)
    )
  }

  /**
   * 从head头部中的meta以及#meta-author中获取基础信息，并在终端中打印
   */
  function getMetaInfo (isPrint) {
    var meta = {};

    var head = document.getElementsByTagName('head')[0];
    // var childNodes = head.childNodes;
    (function (meta, head) {
      var children = head.children
      for (var i = 0, max = children.length; i < max; i++) {
        var child = head.children[i]
        var name = child.getAttribute('name');
        if (child.nodeName === 'TITLE') {
          meta.title = child.innerText;
        } else if (child.nodeName === 'META' && name) {
          meta[name] = child.getAttribute('content');
        } /* else if (child.nodeName === 'mment' && typeof meta['date'] === 'undefined') {
             meta['date'] = child.data.slice(1,-1)
             } */
      }
    })(meta, head);

    var dAuthorInfo = document.getElementById('meta-article');
    if (dAuthorInfo && dAuthorInfo.children.length > 0) {
      (function (meta, dAuthorInfo) {
        var children = dAuthorInfo.children
        for (var i = 0, max = children.length; i < max; i++) {
          var child = children[i]
          var key = child.className;
          if (key === 'email') {
            meta.email = child.children[0].innerHTML;
          } else if (key === 'author') {
            // 名字特殊处理 e.g. Junjia Ni
            // 后面用于头像图片链接地址的拼接(author_en) junjia-ni.png
            var rlt = child.innerHTML.match(/\(.*\)/g);
            if (rlt) meta.author_en = rlt[0].slice(1,-1);
            else meta.author_en = "Junjia Ni"; // avoid the null image
            meta.author = child.innerHTML;
          } else {
            meta[key] = child.innerHTML;
          }
        }
      })(meta, dAuthorInfo)
    }

    if (isPrint === true) {
      // Print the Article's meta information
      (function (meta) {
        console.log('Article\'s Meta');
        var keys = typeof Object.keys === 'function' ? Object.keys(meta) : []
        for (var i = 0, max = keys.length; i < max; i++) {
          var name = keys[i]
          console.log(name.toUpperCase() + ': ' + meta[name]);
        }
      })(meta)
    }

    return meta;
  }
  /**
   * 显示网页的meta信息
   */
  function showMetaInfo (body, content, meta) {
    var div = document.createElement('div'), img = 'Avatar loaeed failure.';
    var glfs = "https://media.githubusercontent.com/media/creamidea/creamidea.github.com/master";
    if (meta.author_en) {
      img = "<img class=author-" + meta.author_en + " src=" + glfs + "/static/img/" + meta.author_en.toLowerCase().replace(/\s/g, '-') + '.png' + "></img>";
    }
    div.id = "author-card"
    div.innerHTML = "" +
      "<div class=\"card\"> " +
      "<div class=\"card-avatar\">" + img + "</div>" +
      "<div class=\"card-content\">" +
      "<h3 class=\"card-name\">" + meta.author  + "</h3>" +
      "<section>" +
      "<p>Email: <a href=\"mailto:" + meta.email +"\">" + meta.email + "</a></p>" +
      "<p>Date: " + meta['date']  + "</p>" +
      "<p alt='Last Modification Time'>LMT: " + meta['last-modification-time']  + "</p>" +
      "</section>" +
      "</div>" +
      "</div>" + "<hr class=\"section-divider\"></hr>";
    content.appendChild(div);
  }

  /**
   * 显示回首页的按钮
   */
  function showHomeButton (body) {
    var div = document.createElement('div');
    var a = document.createElement('a');
    var img = document.createElement('img');
    div.id = "avatar-wapper";
    a.href = '/';
    a.alt = 'Return';
    a.innerHTML = '&#9964;'; // '&#128072;'; // '&#127969;';
    // img.src = './img/avatar.png';
    // img.alt = 'Return';
    div.appendChild(a);
    // a.appendChild(img);
    body.appendChild(div);
  }

  /**
   * 显示页脚信息
   */
  function showFooter (body, content, meta) {
    // TODO: change the email
    var footer = document.createElement('footer')
    var code = '<code class="src src-elisp"><span style="color: #c5c8c6;">(</span><span style="color: #b5bd68;">let</span> <span style="color: #8abeb7;">(</span><span style="color: #f0c674;">(</span>editor <span style="color: #8abeb7;"><a href="http://www.gnu.org/software/emacs/">"Emacs"</a></span><span style="color: #f0c674;">)</span>' +
      '<span style="color: #f0c674;">(</span>generator <span style="color: #b5bd68;">(</span>concat <span style="color: #8abeb7;"> <a href="http://orgmode.org/">"Org-mode"</a></span> <span style="color: #8abeb7;">" &amp; "</span> <span style="color: #8abeb7;"><a href="http://nodejs.org/">"Nodejs"</a></span> <span style="color: #8abeb7;">" &amp; "</span> <span style="color: #8abeb7;"> <a href="https://git-scm.com/">"Git"</a></span><span style="color: #b5bd68;">)</span><span style="color: #f0c674;">)</span>' +
      '<span style="color: #f0c674;">(</span>hostor <span style="color: #8abeb7;"><a href="https://github.com/">"Github"</a></span><span style="color: #f0c674;">)</span><span style="color: #8abeb7;">)</span><span style="color: #c5c8c6;">)</span></code>'
    footer.innerHTML =
      '<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png" /></a><br />This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">Attribution-NonCommercial-ShareAlike 4.0 International License</a>.' +
      '<br />' + code
    // '<p>Author is <a href="'+meta.linkedin+'">'+
    // (meta.author || 'Unknow') + '. ' +
    // '<br /></a> <code class="lisp"> (editor <a href="http://www.gnu.org/software/emacs/">"Emacs"</a>) ' +
    // ' (generator (and <a href="http://orgmode.org/">"Org-mode"</a>' +
    // ' <a href="http://nodejs.org/">"Node"</a> <a href="https://git-scm.com/">"Git"</a>))' +
    // ' (hostor <a href="https://github.com/">"Github"</a>) </code>';
    body.appendChild(footer)
  }

  /**
   * 在每篇文章底部显示标签
   */
  function showTags (body, content, meta) {
    if (!meta.keywords) return;
    var keywords = meta.keywords.split(',');
    if (keywords && keywords.length > 0) {
      var div = document.createElement('div');
      var authorCard = document.getElementById('author-card');
      keywords.forEach(function (key) {
        var a = document.createElement('a');
        // a.href = SEARCHER
        //   + encodeURIComponent(key)
        // + '+site:' + location.host;
        a.href = '/#!/tags?tag=' + encodeURIComponent(key)
        a.title = 'Go to ' + key;
        a.innerHTML = key;
        div.appendChild(a);
      });
      div.id = 'tags';
      content.insertBefore(div, authorCard);
    }
  }


  /**
   * 初始化首页banner图片
   */
  function initImgWapper (body) {
    var div = document.createElement('div');
    div.id = 'img-wapper';
    body.appendChild(div);
    return div;
  }
  /**
   * 图片点击处理
   */
  function ImgClickEvent (body, wapper) {
    function fun (e) {
      var target = e.target;
      if (target.nodeName === 'IMG' || target.id === 'img-wapper') {
        var img = wapper.getElementsByTagName('img')[0]
        // if (target.parentNode.id === 'img-wapper' || target.id === 'img-wapper') {
        if (img) {
          // hide image
          //1.25977
          img.style.transform = 'scale(0.8) translateY(-50px)'
          setTimeout(function(){
            wapper.removeChild(img);
            wapper.style.opacity = 0;
            wapper.style.display = 'none';
            body.style.overflow = null;
          }, 150);
        } else {
          // show image
          var _img = document.createElement('img');
          _img.src = e.target.src
          _img.style.maxWidth = '100%'
          wapper.appendChild(_img);
          wapper.style.display = 'block';
          wapper.style.opacity = 1;
          var wapperW = wapper.getBoundingClientRect().height
          var imgW = _img.getBoundingClientRect().height || 366
          var scale = (wapperW + imgW) / 2 / imgW
          if (scale > 1) scale = 0.98
          var distance = (wapperW - imgW * scale) / 2
          _img.style.transform = 'scale('+ scale +') translateY('+ distance +'px)';
          body.style.overflow = 'hidden';
        }
      }
    }
    addEventListener(body, 'click', fun)
  }

  /**
   * 为h2 h3 h4标题类型后面增加#符号
   */
  function someArticlesFix (body, content, isHome) {
    // var tableOfContents = document.getElementById('table-of-contents')
    // tableOfContents.style.display = 'none'
    function genTagA (h) {
      var a = document.createElement('a');
      a.href = '#' + h.id;
      a.innerHTML = '#';
      return a;
    }
    if (__forEach) {
      __forEach.call(['h2', 'h3', 'h4'], function (hTag) {
        __forEach.call(document.getElementsByTagName(hTag), function (h) {
          h.appendChild(genTagA(h));
        })
      })
    }
  }

  function changeBodyTopStyle (body) {
    var head = document.getElementsByTagName('head')[0]
    var pathname = location.pathname

    // Body Top Style
    var meta = document.createElement('meta')
    meta.name = "theme-color"
    if (pathname.indexOf('articles') >= 0) {
      body.style.borderTop = '2px solid #191919'
      meta.content = '#191919'
    } else if (pathname.indexOf('translation') >= 0) {
      body.style.borderTop = '2px solid #ED462F'
      meta.content = '#ED462F'
    } else if (pathname.indexOf('wiki') >= 0) {
      body.style.borderTop = '2px solid #4285f4'
      meta.content = '#4285f4'
    }
    head.appendChild(meta)

    // TOP Right
    var btnReturn = document.createElement('a')
    btnReturn.className = 'return'
    if (location.pathname.search(/\/wiki\//i) >= 0) {
      btnReturn.href = '/'
    } else {
      btnReturn.href = '/#!/archive'
    }
    body.appendChild(btnReturn)

    var githubBadge = document.createElement('a')
    githubBadge.href = 'https://github.com/creamidea/creamidea.github.com/'
    githubBadge.className = 'github-badge'
    githubBadge.innerHTML = '<svg aria-hidden="true" class="octicon octicon-mark-github" height="24" version="1.1" viewBox="0 0 16 16" width="24"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"></path></svg>'
    body.appendChild(githubBadge)
  }

  function showWarning (content, meta) {
    var daysAgo = Math.round((Date.now() - new Date(meta.date)) / 86400000) // (24 * 60 * 60 * 1000)
    if (daysAgo > 365) {
      var pg1 = document.getElementById('table-of-contents')
      var elt = document.createElement('div')
      elt.style.fontSize = '16px'
      elt.className = 'alert alert-warning'
      elt.innerHTML = '文章发表于<strong>' + daysAgo + '</strong>天前。日期过于久远，请合理参考。<br />' +
        'This article was created at <strong>'+ daysAgo +'</strong> days ago. It is too long, so please pay more attention.'
      content.insertBefore(elt, pg1)
    }
  }

  /**
   * Lazy load images
   */
  function loadImage (el, fn) {
    var img = document.createElement('img')
    , src = el.getAttribute('data-src')
    img.onerror = function () {
      console.log('Lazy load image error.')
    }
    img.onload = function() {
      if (!! el.parent)
        el.parent.replaceChild(img, el)
      else
        el.src = src;
      el.removeAttribute('lazy-load')
      fn ? fn() : null
    }
    img.src = src;
  }
  function processScroll (images) {
    for (var i = 0; i < images.length; i++) {
      if (elementInViewport(images[i])) {
        loadImage(images[i], function () {
          images.splice ? images.splice(i, i) : null
        });
      }
    };
  }
  function loadLazyImage (content) {
    // https://css-tricks.com/snippets/javascript/lazy-loading-images/
    var imgs = []
    if (content.querySelectorAll) {
      imgs = content.querySelectorAll('img[lazy-load]')
    } else {
      imgs = __filter.call(content.getElementsByTagName('img'), function (img) {
        if(img.hasAttribute('lazy-load')) {
          return true
        } else {
          return false
        }
      })
    }

    if (window.hasOwnProperty("touchmove")) {
      addEventListener(window, 'touchmove', function () {
        processScroll(imgs)
      }); // Touch
    } else {
      addEventListener(window, 'scroll', function () {
        processScroll(imgs)
      });  // Mouse
    }
    processScroll(imgs)
  }

  function hateYou () {
    var hit = document.createElement('div')
    hit.innerHTML = '<p>Oops! Your browser is too outmoded. '
        + 'Would you please try the lastest <a href="https://www.google.com/chrome/">Chrome</a>?</p>'
    hit.style.textAlign = 'center'
    hit.style.background = '#ed462f'
    hit.style.color = 'white'
    hit.style.padding = '4px'
    hit.style.fontSize = '20px'
    document.getElementsByTagName('body')[0].insertBefore(hit, document.getElementById('content'))
  }

  /**
   * entry point
   */
  (function () {
    var running = false
    var loadEvent = ['DOMContentLoaded', 'load']

    var pathname = window.location.pathname
    var body = document.getElementsByTagName('body')[0]
    var content = document.getElementById('content')
    var meta = getMetaInfo(true) // true -> print meta info

    for (var i = 0, max = loadEvent.length; i < max; i++) {
      var event = loadEvent[i]
      addEventListener(window, event, function () {
        if (!running) {
          running = true

          if (typeof __forEach === 'undefined') {
            // too old
            hateYou()
          }

          changeBodyTopStyle(body)
          showWarning(content, meta)
          showMetaInfo(body, content, meta)
          showFooter(body, content, meta)
          someArticlesFix(body, content)
          // loadCustomSearch(content, document.getElementById('#outline_disqus_thread'))

          if (typeof __forEach == 'function') {
            showTags(body, content, meta)
            loadLazyImage(content)
            // showHomeButton(body)
            ImgClickEvent(body, initImgWapper(body))
            loadDisqus(body, content)
          }
          removeEventListener(window, event, function () {})
        }
      }, false)
    }
  })()

})(this)
