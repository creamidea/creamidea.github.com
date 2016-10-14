"use strict";function getMetaInfo(e){var t=document.getElementsByTagName("head")[0],a=t.childNodes,n={};__forEach.call(t.children,function(e){var t=e.getAttribute("name");return"TITLE"===e.nodeName?void(n.title=e.innerText):void(null!==t&&""!==t&&void 0!==t&&(n[t]=e.getAttribute("content")))});for(var o=0,r=a.length;o<r;o++){var s=a[o];if("#comment"===s.nodeName){n.generatedTime=s.data.slice(1,-1);break}}var i=document.getElementById("meta-article");return i&&i.children.length>0&&__forEach.call(i.children,function(e){var t=e.className;if("email"===t)n.email=e.children[0].innerHTML;else if("author"===t){var a=e.innerHTML.match(/\(.*\)/g);a?n.author_en=a[0].slice(1,-1):n.author_en="Junjia Ni",n.author=e.innerHTML}else n[t]=e.innerHTML}),e===!0&&(console.log("Article's Meta"),__forEach.call(Object.keys(n),function(e){console.log(e.toUpperCase()+": "+n[e])})),n}function showMetaInfo(e,t,a){var n=document.createElement("div"),o="Avatar loaeed failure.",r="https://media.githubusercontent.com/media/creamidea/creamidea.github.com/master";a.author_en&&(o="<img class=author-"+a.author_en+" src="+r+"/static/img/"+a.author_en.toLowerCase().replace(/\s/g,"-")+".png></img>"),n.innerHTML='<div class="card"> <div class="card-avatar">'+o+'</div><div class="card-content"><h3 class="card-name">'+a.author+'</h3><section><p>Email: <a href="mailto:'+a.email+'">'+a.email+"</a></p><p>Date: "+a.date+"</p><p alt='Last Modification Time'>LMT: "+a["last-modification-time"]+'</p></section></div></div><hr class="section-divider"></hr>',t.appendChild(n)}function showHomeButton(e){var t=document.createElement("div"),a=document.createElement("a");document.createElement("img");t.id="avatar-wapper",a.href="/",a.alt="Return",a.innerHTML="&#9964;",t.appendChild(a),e.appendChild(t)}function showFooter(e,t,a){var n=document.createElement("footer"),o='<code class="src src-elisp"><span style="color: #c5c8c6;">(</span><span style="color: #b5bd68;">let</span> <span style="color: #8abeb7;">(</span><span style="color: #f0c674;">(</span>editor <span style="color: #8abeb7;"><a href="http://www.gnu.org/software/emacs/">"Emacs"</a></span><span style="color: #f0c674;">)</span><span style="color: #f0c674;">(</span>generator <span style="color: #b5bd68;">(</span>concat <span style="color: #8abeb7;"> <a href="http://orgmode.org/">"Org-mode"</a></span> <span style="color: #8abeb7;">" &amp; "</span> <span style="color: #8abeb7;"><a href="http://nodejs.org/">"Nodejs"</a></span> <span style="color: #8abeb7;">" &amp; "</span> <span style="color: #8abeb7;"> <a href="https://git-scm.com/">"Git"</a></span><span style="color: #b5bd68;">)</span><span style="color: #f0c674;">)</span><span style="color: #f0c674;">(</span>hostor <span style="color: #8abeb7;"><a href="https://github.com/">"Github"</a></span><span style="color: #f0c674;">)</span><span style="color: #8abeb7;">)</span><span style="color: #c5c8c6;">)</span></code>';n.innerHTML='<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png" /></a><br />This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">Attribution-NonCommercial-ShareAlike 4.0 International License</a>.<br />'+o,e.appendChild(n)}function showTags(e,t,a){if(a.keywords){var n=a.keywords.split(",");if(n&&n.length>0){var o=document.createElement("div"),r=document.getElementById("footnotes");n.forEach(function(e){var t=document.createElement("a");t.href=SEARCHER+encodeURIComponent(e),t.title="Go to "+e,t.innerHTML=e,o.appendChild(t)}),o.id="tags",t.insertBefore(o,r)}}}function ImgClickEvent(e,t){function a(a){var n=t.getElementsByTagName("img"),o=a.target;if("IMG"===o.nodeName||"img-wapper"===o.id)if(n.length>0||"img-wapper"===o.id)t.style.opacity=0,e.style.overflow=null,setTimeout(function(){for(var e=0,a=n.length;e<a;e++)n[e].style.transform="scale(1.25977) translateZ(0)",t.removeChild(n[e]);t.style.display="none"},100);else if(0===n.length){var n=document.createElement("img");n.src=a.target.src,t.appendChild(n),t.style.display="block",setTimeout(function(){t.style.opacity=1,n.style.transform="scale(1.25977) translateZ(0)"},100),e.style.overflow="hidden"}}e.addEventListener("click",a,!1)}function someArticlesFix(e,t,a){function n(e){var t=document.createElement("a");return t.href="#"+e.id,t.innerHTML="#",t}["h2","h3","h4"].forEach(function(e){__forEach.call(document.getElementsByTagName(e),function(e){e.appendChild(n(e))})})}function loadCustomSearch(e,t){var a="017951989687920165329:0e60irxxe5m",n=document.createElement("script");n.type="text/javascript",n.async=!0,n.src="https://cse.google.com/cse.js?cx="+a,n.onload=function(){var a=document.createElement("div");a.id="custom-search",a.innerHTML="<gcse:search></gcse:search>",e.insertBefore(a,t),console.log("Google Custom Search Engine Loaded Over.")};var o=document.getElementsByTagName("script")[0];o.parentNode.insertBefore(n,o)}function loadDisqus(e,t){t&&setTimeout(loadDisqusComment,1314)}function loadDisqusComment(e){if(e){var t=e.parentElement;t.style.display="none"}window.disqus_config=function(){this.page.identifier=location.pathname.split("/").slice(-2).join("/")};var a=document,n=document.createElement("script");n.src="//creamidea.disqus.com/embed.js",n.setAttribute("data-timestamp",+new Date),(a.head||a.body).appendChild(n);var o=document.getElementById("content"),r=document.createElement("div");r.id="outline_disqus_thread",r.className="outline-2",r.style.marginBottom="44px",r.innerHTML='<h2 id="disqus_thread_header">Comments</h2><div id="disqus_thread"><p style="text-align:center;font-family: Georgia1,Georgia,Times New Roman,Times,serif;">Disqus is loading...</p></div>',o.appendChild(r)}function changeBodyTopStyle(e){var t=document.getElementsByTagName("head")[0],a=location.pathname,n=document.createElement("meta");n.name="theme-color",a.indexOf("articles")>=0?(e.style.borderTop="2px solid #191919",n.content="#191919"):a.indexOf("translation")>=0?(e.style.borderTop="2px solid #ED462F",n.content="#ED462F"):a.indexOf("wiki")>=0&&(e.style.borderTop="2px solid #4285f4",n.content="#4285f4"),t.appendChild(n);var o=document.createElement("a");o.className="return",location.pathname.search(/\/wiki\//i)>=0?o.href="/":o.href="/#!/archive",e.appendChild(o);var r=document.createElement("a");r.href="https://github.com/creamidea/creamidea.github.com/",r.className="github-badge",r.innerHTML='<svg aria-hidden="true" class="octicon octicon-mark-github" height="24" version="1.1" viewBox="0 0 16 16" width="24"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"></path></svg>',e.appendChild(r)}function showWarning(e,t){var a=Math.round((Date.now()-new Date(t.date))/864e5);if(a>365){var n=document.getElementById("table-of-contents"),o=document.createElement("div");o.style.fontSize="16px",o.className="alert alert-warning",o.innerHTML="文章发表于<strong>"+a+"</strong>天前。日期过于久远，请合理参考。<br />This article was created at <strong>"+a+"</strong> days ago. It is too long, so please pay more attention.",e.insertBefore(o,n)}}function main(){var e=(window.location.pathname,document.getElementsByTagName("body")[0]),t=document.getElementById("content"),a=getMetaInfo(!0);changeBodyTopStyle(e),showWarning(t,a),showTags(e,t,a),someArticlesFix(e,t),showMetaInfo(e,t,a),loadDisqus(e,t),loadCustomSearch(t,document.querySelector("#outline_disqus_thread")),showFooter(e,t,a)}var __forEach=Array.prototype.forEach,__slice=Array.prototype.slice,SEARCHER="https://cse.google.com/cse/publicurl?cx=017951989687920165329:0e60irxxe5m&hl=en&q=";document.addEventListener("DOMContentLoaded",function(){main()},!1);
//# sourceMappingURL=article.js.map