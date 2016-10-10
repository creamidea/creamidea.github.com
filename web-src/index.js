/**
 * 增加首页背景图片的容器
 */
var __map = Array.prototype.map
var __forEach = Array.prototype.forEach

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

function showBanner (body, content) {
  var div = document.createElement('div');
  div.id = 'banner-wrapper';
  div.innerHTML = '<p style="text-align: center;font-size: 14em; margin: 0;">&gt;<span class="blink" data-frequency="700">_</span></p>';
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

function loadArchive (body, callback) {
  var iframe = document.createElement('iframe')
  iframe.src = '/static/html/archive.html'
  iframe.style.display = 'none'
  iframe.onload = function () {
    if (typeof callback === 'function') {
      var content = iframe.contentDocument || iframe.contentWindow.document
      callback(
        content.querySelector('.article-list'),
        content.querySelector('.special-list')
      )
    }
  }
  body.appendChild(iframe)

}

function createNavDom (o) {
  var a = document.createElement('a')
  a.href = o.href
  a.innerHTML = o.text
  a.onclick = o.onclick
  return a
}

function toggleArchive (articlesList, body, article, nav) {
  body.style.backgroundColor = ''
  article.appendChild(articleList)

}

window.onload = function () {
  var body = document.getElementsByTagName('body')[0]
  var nav = document.querySelector('nav')
  var article = document.querySelector('article')
  var banner
  var btnReturn = document.createElement('a')

  var Animate = {
    show: function (articleList) {
      if (article.innerHTML === '') {
        // btnReturn.innerHTML = 'Return'
        btnReturn.onclick = function (e) {
          e.preventDefault()
          Animate.hide()
        }
        body.appendChild(btnReturn)
        article.appendChild(articleList)
      }

      // hide others
      nav.className="bounceOut animated"
      banner.className="bounceOut animated"

      // show articles
      article.style.display = "block"
      btnReturn.style.display = "block"
      article.className = 'bounceInUp animated'
      btnReturn.className = 'return bounceInUp animated'

      // change body backgroundcolor
      body.style.background = '#fafafa'
    },
    hide: function () {
      // change body backgroundcolor
      body.style.background = ''

      // show others
      nav.className="bounceIn animated"
      banner.className="bounceIn animated"

      // hide articles
      article.className = 'bounceOutDown animated'
      btnReturn.className = 'return bounceOutDown animated'

      setTimeout(function () {
        article.style.display = "none"
        btnReturn.style.display = "none"
      }, 1000)
    }
  }

  loadArchive(body, function (articleList, specialList) {
    var archive = nav.appendChild(createNavDom({
      text: 'Archive',
      onclick: function (e) {
        e.preventDefault()
        // var url = '/archive'
        // history.pushState({
        //   url: url
        // }, '', url);
        Animate.show(articleList)
      }}))

    __map.call(specialList.children, function (item) {
      var title = item.querySelector('.title')
      var name = title.innerHTML
      if (['friends', 'works'].indexOf(name) >= 0) {
        nav.appendChild(createNavDom({
          href:title.href, text: name
        }))
      }
    })

  })

  banner = showBanner(body, nav)
}
