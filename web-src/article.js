'use strict'

var __forEach = Array.prototype.forEach
var __slice = Array.prototype.slice

/**
 * 从head头部中的meta以及#meta-author中获取基础信息，并在终端中打印
 */
function getMetaInfo (isPrint) {
  var head = document.getElementsByTagName('head')[0];
  var childNodes = head.childNodes;
  var meta = {};
  __forEach.call(head.children, function (child) {
    var name = child.getAttribute('name');
    if (child.nodeName === 'TITLE') {
      meta.title = child.innerText;
      return;
    }
    if (name === null || name === "" || name === undefined) return;
    meta[name] = child.getAttribute('content');
  });
  for (var i = 0, max = childNodes.length; i < max; i++) {
    var cn = childNodes[i];
    if (cn.nodeName !== '#comment') continue;
    // TODO: maybe here will wrong
    meta.generatedTime = cn.data.slice(1,-1); // remove the blank symbol
    break;
  }

  var dAuthorInfo = document.getElementById('meta-article');
  if (dAuthorInfo && dAuthorInfo.children.length > 0) {
    __forEach.call(dAuthorInfo.children, function (child) {
      var key = child.className;
      if (key === 'email') meta.email = child.children[0].innerHTML;
      else if (key === 'author') {
        // 名字特殊处理 e.g. Junjia Ni
        // 后面用于头像图片链接地址的拼接(author_en) junjia-ni.png
        var rlt = child.innerHTML.match(/\(.*\)/g);
        if (rlt) meta.author_en = rlt[0].slice(1,-1);
        else meta.author_en = "Junjia Ni"; // avoid the null image
        meta.author = child.innerHTML;
      }
      else meta[key] = child.innerHTML;
    });
  }

  if (isPrint === true) {
    // Print the Article's meta information
    console.log('Article\'s Meta');
    __forEach.call(Object.keys(meta), function (name) {
      console.log(name.toUpperCase() + ': ' + meta[name]);
    });
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
    var footnotes = document.getElementById('footnotes');
    // var searchEngine = 'https://www.laiguge.com/search?hl=en&q=';
    // var searchEngine = 'http://0s.o53xo.m5xw6z3mmuxgg33n.erenta.ru/?gws_rd=ssl#hl=en&q=';
    var searchEngine = 'https://www.google.com/?gws_rd=ssl#hl=en&q=';
    keywords.forEach(function (key) {
      var a = document.createElement('a');
      a.href = searchEngine +
        key + '+site:' + window.location.hostname;
      a.title = 'Go to ' + key;
      a.innerHTML = key;
      div.appendChild(a);
    });
    div.id = 'tags';
    content.insertBefore(div, footnotes);
  }
}

/**
 * 图片点击处理
 */
function ImgClickEvent (body, wapper) {
  function fun (e) {
    var img = wapper.getElementsByTagName('img');
    var target = e.target;
    if (target.nodeName === 'IMG' || target.id === 'img-wapper') {
      if (img.length > 0 || target.id === 'img-wapper') {
        // hide image
        wapper.style.opacity = 0;
        body.style.overflow = null;
        setTimeout(function(){
          for (var i = 0, max = img.length; i < max; i++) {
            img[i].style.transform = 'scale(1.25977) translateZ(0)';
            wapper.removeChild(img[i]);
          }
          wapper.style.display = 'none';
        }, 100);
      } else if (img.length === 0) {
        // show image
        var img = document.createElement('img');
        img.src = e.target.src;
        wapper.appendChild(img);
        wapper.style.display = 'block';
        setTimeout(function () {
          wapper.style.opacity = 1;
          img.style.transform = 'scale(1.25977) translateZ(0)';
        }, 100);
        body.style.overflow = 'hidden';
      }
    }
  }
  body.addEventListener('click', fun, false);  //非IE浏览器
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
  ['h2', 'h3', 'h4'].forEach(function (hTag) {
    __forEach.call(document.getElementsByTagName(hTag), function (h) {
      h.appendChild(genTagA(h));
    });
  });
}

/**
 * load disqus
 */
function loadDisqus(body, content) {
  if (content) {
    // var div = document.createElement('div');
    // div.className = 'comm';
    // div.innerHTML = '<div class="comm_open_btn" comment="copy from bilibili.com :P" onclick="loadDisqusComment(this)"></div>';
    // content.appendChild(div);
    setTimeout(loadDisqusComment, 1314);
  }
}
function loadDisqusComment (target) {
  if (target) {
    var parent = target.parentElement;
    parent.style.display = 'none';
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
  disqus.innerHTML = '<h2 id="disqus_thread_header">Comments</h2><div id="disqus_thread"><p style="text-align:center;font-family: Georgia1,Georgia,Times New Roman,Times,serif;">Disqus is loding...</p></div>';
  content.appendChild(disqus);
}
function disqus_config () {
  // 这里是配置disqus地方，具体可以参考
  // https://help.disqus.com/customer/portal/articles/472098-javascript-configuration-variables
}

function changeBodyTopStyle (body) {
  var head = document.getElementsByTagName('head')[0]
  var pathname = location.pathname
  var meta = document.createElement('meta')
  meta.name = "theme-color"
  if (pathname.indexOf('articles') >= 0) {
    body.style.borderTop = '2px solid #191919'
    meta.content = '#191919'
  } else if (pathname.indexOf('translation') >= 0) {
    body.style.borderTop = '2px solid #ED462F'
    meta.content = '#ED462F'
  }
  head.appendChild(meta)
}

/**
 * entry point
 */
function main() {
  var pathname = window.location.pathname
  var body = document.getElementsByTagName('body')[0]
  var content = document.getElementById('content')
  var meta = getMetaInfo(true)

  changeBodyTopStyle(body)
  showTags(body, content, meta)
  // showHomeButton(body)
  // ImgClickEvent(body, initImgWapper(body, content))
  someArticlesFix(body, content)
  showMetaInfo(body, content, meta)
  loadDisqus(body, content)
  showFooter(body, content, meta)
}

document.addEventListener('DOMContentLoaded', function () {
  main()
}, false)
