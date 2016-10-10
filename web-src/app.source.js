'use strict';

var __forEach = Array.prototype.forEach;
var __slice = Array.prototype.slice;
var rActive = /active/g;

/**
 * 变换首页octocat图片 iframe方案
 */
function changeOctoCat2 (body) {
  var iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  iframe.src = 'https://octodex.github.com/';
  iframe.id = 'octodex';
  iframe.onload = function () {
    console.log('iframe load success');
  };
  body.appendChild(iframe);
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
      oBannerWrapper.style.background = 'url('+ src +') no-repeat top center fixed';
      oBannerWrapper.style.backgroundSize = '424px 424px';
      oBannerWrapper.innerHTML = '<p style="display: block;margin:0;position:absolute;bottom:0;left:1%;right:1%;line-height:1;"><a href="https://github.com/" alt="Check me out on :octocat:" title="Check me out on :octocat:" style="color:black;font-size:16px;font-family:Georgia1,Georgia,Times New Roman,Times,serif;font-style: italic;">'+octocat.title+'</a></p>';
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
 * 初始化首页banner图片
 */
function initImgWapper (body) {
  var div = document.createElement('div');
  div.id = 'img-wapper';
  body.appendChild(div);
  return div;
}

/*
 * 用于获取index.html中的分类内容，主要是 articles wiki 这两个分类
 */
function genCategories (body, content) {
  var orgUl = content.children[1];
  // var categories = [];
  var sTitle = {
    articles: "Articles",
    wiki: "Wiki"
  };
  var navTabs = [], tabContent = [];
  if (orgUl) {
    __forEach.call(orgUl.children, function (li, index) {
      var _name, title, children, _tabContent = [];
      var div = document.createElement('div');
      _name = li.firstChild.textContent.replace(/\s/g, "");
      if (_name === 'wiki') return; // temporarily exculde wiki
      title = sTitle[_name];
      children = li.children[0].children;

      // TODO: 这里后面需要调整一下，如果URL变化，这样做是不会有什么变化的。
      navTabs.push(
        '<li role="presentation" class="'+_name+'"><a onClick=showTabpane("'+_name+'") href="#'+_name+'">' +
          title +
          '</a></li>'
      );

      div.className = "tab-pane";
      div.id = _name;
      __forEach.call(children, function(c) {
        var a = c.children[0];
        // 去掉friends.html
        if ( a.innerHTML.search(/friends/i) >= 0 ) return;
        _tabContent.push(
          a.innerHTML.replace(
              /(.*) (\d{4}-\d{2}-\d{2})/, // $2 is the Last Modification Time
            '<li class="link" style="list-style-type: initial;"><span class="date">$2 &#8594; </span><a href="'+ a.getAttribute('href') + '" style="color:#333333;">$1</a></li>'));
      });
      // &#8611; http://character-code.com/arrows-html-codes.php

      // pagin
      tabContent.push('<div class="tab-pane" id="'+ _name +'">'+paging(_tabContent, content).join(' ')+'</div>');
    });

    navTabs.push(
      '<li role="presentation" class="about"><a href="/static/about.html">Ab<span style="color: #ED462F;font-size: 0.89em;">&hearts;</span>ut</a></li>');
    navTabs.push(
      '<li role="presentation" class="friends"><a href="/wiki/friends.html">Friends</a></li>');
    // navTabs.push(
    //   '<li role="presentation" class="octocat"><a href="https://octodex.github.com/">Octocats</a></li>');
    content.innerHTML =
      '<ul class="nav nav-tabs" role="tablist">'+ navTabs.join(' ') +'</ul>' +
      '<div class="tab-content">'+ tabContent.join('') +'</div>'
      + '<div class="next-page-left"><a onclick="nextPage(this, -1)">&lt;</a></div><div class="next-page-right"><a onclick="nextPage(this, 1)">&gt;</a></div>' +
      '<div class="page-footer" style="text-align: right; font-size: 1.2em;"></div>';
    // blink()
  } else {
    console.error('At Home Page: Parse content Error! The Org UL isnt exist.');
  }
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
 * @param {name} String 这个是点击之后，传入的name
 * @param {_name} String 这个是要被匹配的name
 * @param {pagnum} Int 这个是页码，默认为1
 * @retrun {String} 返回加上active的className
 */
function showTabpane (name, pagnum) {
  if (!pagnum) pagnum = 1;
  window._category = name; // Please more attension
  var dCategory = document.getElementById(name);
  var xx_total = dCategory ? dCategory.children.length : 0;
  if (dCategory && xx_total > 1) {
    document.getElementsByClassName('next-page-left')[0].style.display = 'block';
    document.getElementsByClassName('next-page-right')[0].style.display = 'block';
  } else {
    document.getElementsByClassName('next-page-left')[0].style.display = 'none';
    document.getElementsByClassName('next-page-right')[0].style.display = 'none';
  }
  showPageFooter(pagnum, xx_total);

  /**
   * 给class加上active，外层不用管是否有active
   * 如果有active，会自动去掉
   */
  function addActive (_className, name, _name) {
    _className = _className.replace(/\s*$/g, '');
    if (_name === name && _className.search(rActive) >= 0) {
      // do nothing
    } else if (_name === name) {
      _className += ' active';
    } else {
      _className = _className.replace(rActive, '');
    }
    return _className;
  }

  __forEach.call(document.getElementsByClassName('nav-tabs')[0].children, function(li) {
    var a = li.children[0];
    var a_name = a.getAttribute('href').slice(1);
    var _className = li.className;
    li.className = addActive(_className, name, a_name);
  });
  __forEach.call(document.getElementsByClassName('tab-content')[0].children, function (pane) {
    var _name = pane.id;
    var _className = pane.className;
    var pages = pane.children;
    pane.className = addActive(_className, name, _name);

    __forEach.call(pages, function (page, index) {
      var _pagnum = parseInt(page.getAttribute('pagnum'), 10);
      page.className = page.className.replace(/\s*active/g, '');
      if (_pagnum === pagnum) {
        page.className = page.className + ' active';
      }
    });
  });
}
/**
 * 分页函数
 */
function paging (_tabContent, content) {
  var pages = [], frg = 100, tabContentLength = _tabContent.length;
  var s_cursor = 0, e_cursor = tabContentLength / frg;
  e_cursor = parseInt(e_cursor.toString().split('.')[0], 10);
  if (e_cursor === 0 || tabContentLength % frg) {
    e_cursor += 1;
  }
  for (var i = 0; i < e_cursor; i++) {
    pages.push('<ul class="page" pagnum="'+ (i+1) +'">' + _tabContent.slice(s_cursor, s_cursor + frg).join(' ') + '</ul>');
    s_cursor += frg;
  }
  return pages;
}
/**
 * 翻页函数
 */
function nextPage (elt, direction) {
  var category = window._category;
  var pagnum = parseInt(window._search.pagnum, 10) || 1;
  var total = document.getElementById(category).children.length;
  var next;

  switch (direction) {
  case 1:
    next = pagnum + 1 > total ? 1 : pagnum + 1;
    break;
  case -1:
    next = pagnum - 1 < 1 ? total : pagnum - 1;
    break;
  default:
    break;
  }
  if (next) {
    showTabpane(category, next);
    window.location.hash = '#' + category + '?pagnum=' + next;
    window._category = category;
    window._search.pagnum = next;
  }
}
/**
 * 分页页脚 1/2
 */
function showPageFooter (next, total) {
  if (!total) {
    var oCategory = document.getElementById(window._category);
    total = oCategory ? oCategory.children.length : 0;
  }
  var pageFooter = document.getElementsByClassName('page-footer')[0];
  if (total <= 1) {
    pageFooter.style.display = 'none';
    return;
  }
  pageFooter.style.display = 'block';
  if (!next) next = window._search.pagnum || 1;
  if (next > total) next = NaN;
  pageFooter.innerHTML = next + '/' + total;
}
/**
 * 对URL中的hash部分进行分解
 * e.g. /#articles?pagnum=1
 */
function hashBreakDown () {
  var hash = window.location.hash.slice(1);
  var _hash = hash.split('?');
  var _category = _hash[0];
  var search = (_hash[1] && _hash[1].split('&')) || [], _search = {};
  __forEach.call(search, function (s, index) {
    var a = s.split('=');
    _search[a[0]] = a[1];
  });
  window._category = _category;
  window._search = _search;
}
function someHomeFix (body, content, pathname) {
  // show the correct content
  content.style.position = 'relative';
  var category = window._category;
  var pagnum = parseInt((window._search.pagnum), 10) || 1;
  showTabpane(category, pagnum);

  // var orgUl = document.getElementsByClassName('org-ul')[0]
  // orgUl.style.listStyleType = 'lower-greek'
  // var style = document.createElement('style')
  // style.innerText = "#content ul {margin-left: 40px;font-size: 1.4em;} #content a {text-decoration: none;}"
  // orgUl.appendChild(style)

  // document.getElementById('org-div-home-and-up').style.display = 'none'
}

/**
 * 页面右上角处理 HOME/GMAIL
 */
function orgDivHomeAndUpFix (body, content, meta, isHome) {
  var orgDivHomeAndUp = document.getElementById('org-div-home-and-up');
  var Links = [{
    "name": 'HOME', "url": '/', text: '&#x2302;'
  // }, {
  //   "name": 'GMAIL', "url": 'mailto:'+meta.gmail, text: 'GMAIL
  }];
  var hLinks = [];

  if (!orgDivHomeAndUp) {
    orgDivHomeAndUp = document.createElement('div');
    orgDivHomeAndUp.id = 'org-div-home-and-up';
    body.insertBefore(orgDivHomeAndUp, content, false);
  }
  if (isHome) {
    orgDivHomeAndUp.style.position = 'fixed';
    orgDivHomeAndUp.style.right = 0;
    orgDivHomeAndUp.style.zIndex = 10;
  }

  Links.forEach(function (link) {
    var lname = '';

    if (link.name === 'HOME' && isHome) return;

    if (link.name.toUpperCase() === 'GMAIL') {
      var colors = ['#0C77B6', '#D82C2D', '#FCCB0A', '#0C77B6', '#31B454'];
      link.name.split('').forEach(function (c, i) {
        lname += '<span style="color:'+colors[i]+';">' + c + '</span>';
      });
    } else {
      lname = link.text;
    }
    hLinks.push('<a href='+ link.url+' title="'+link.name+'">'+lname+'</a>');
  });
  orgDivHomeAndUp.innerHTML = hLinks.join(' ');
}

function main() {
  var pathname = window.location.pathname;
  var body = document.getElementsByTagName('body')[0];
  var content = document.getElementById('content');
  var meta = getMetaInfo(true);
  var isHome = false;

  if (window.location.pathname === '/') isHome = true;
  orgDivHomeAndUpFix(body, content, meta, isHome);

  showTags(body, content, meta);
  if (isHome) {
    hashBreakDown();
    genCategories(body, content);
    showBanner(body, content);
    someHomeFix(body, content, pathname);
    blink();
  } else {
    // showHomeButton(body);
    ImgClickEvent(body, initImgWapper(body, content));
    someArticlesFix(body, content);
    showMetaInfo(body, content, meta);
    loadDisqus(body, content);
    showFooter(body, content, meta);
  }
}

if (document.addEventListener)
  document.addEventListener('DOMContentLoaded', function () {
    main();
  }, false);
else
  window.attachEvent('onDOMContentLoaded', function () {
    main();
  });
