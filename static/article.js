"use strict";!function(e){function t(e,t){var n=document.getElementsByTagName("script")[0],a="017951989687920165329:0e60irxxe5m",o=document.createElement("script");o.type="text/javascript",o.async=!0,o.onload=function(){var n=document.createElement("div");n.id="custom-search",n.innerHTML="<gcse:search></gcse:search>",e.insertBefore(n,t),console.log("Google Custom Search Engine Loaded Over.")},n.parentNode.insertBefore(o,n),o.src="https://cse.google.com/cse.js?cx="+a}function n(e,t){t&&setTimeout(a,1314)}function a(t){if(t){var n=t.parentElement;n.style.display="none"}e.disqus_config=function(){this.page.identifier=location.pathname.split("/").slice(-2).join("/")};var a=document,o=document.createElement("script");o.src="//creamidea.disqus.com/embed.js",o.setAttribute("data-timestamp",+new Date),(a.head||a.body).appendChild(o);var r=document.getElementById("content"),i=document.createElement("div");i.id="outline_disqus_thread",i.className="outline-2",i.style.marginBottom="44px",i.innerHTML='<h2 id="disqus_thread_header">Comments</h2><div id="disqus_thread"><p style="text-align:center;font-family: Georgia1,Georgia,Times New Roman,Times,serif;">Disqus is loading...</p></div>',r.appendChild(i)}function o(t,n,a){function o(t,n){e.addEventListener?this.addEventListener(t,n,!1):e.attachEvent?this.attachEvent("on"+t,n):this["on"+t]=n}o.call(t,n,a)}function r(t,n,a){function o(t,n){e.removeEventListener?this.removeEventListener(t,n,!1):e.detachEvent?this.detachEvent("on"+t,n):null}o.call(t,n,a)}function i(t){var n=t.getBoundingClientRect();return n.top>=0&&n.left>=0&&n.top<=(e.innerHeight||document.documentElement.clientHeight)}function c(e){for(var t=document.getElementsByTagName("head")[0],n=t.childNodes,a={},o=0,r=t.children;o<r;o++){var i=t.children[o],c=i.getAttribute("name");if("TITLE"===i.nodeName)return void(a.title=i.innerText);if(null===c||""===c||void 0===c)return;a[c]=i.getAttribute("content")}for(var s=0,l=n.length;s<l;s++){var d=n[s];if("#comment"===d.nodeName){a.generatedTime=d.data.slice(1,-1);break}}var m=document.getElementById("meta-article");return m&&m.children.length>0&&!function(e,t){for(var n=t.children,a=0,o=n.length;a<o;a++){var r=n[a],i=r.className;if("email"===i)e.email=r.children[0].innerHTML;else if("author"===i){var c=r.innerHTML.match(/\(.*\)/g);c?e.author_en=c[0].slice(1,-1):e.author_en="Junjia Ni",e.author=r.innerHTML}else e[i]=r.innerHTML}}(a,m),e===!0&&(console.log("Article's Meta"),function(e){for(var t=Object.keys(e),n=0,a=t.length;n<a;n++){var o=e[n];console.log(o.toUpperCase()+": "+e[o])}}(a)),a}function s(e,t,n){var a=document.createElement("div"),o="Avatar loaeed failure.",r="https://media.githubusercontent.com/media/creamidea/creamidea.github.com/master";n.author_en&&(o="<img class=author-"+n.author_en+" src="+r+"/static/img/"+n.author_en.toLowerCase().replace(/\s/g,"-")+".png></img>"),a.innerHTML='<div class="card"> <div class="card-avatar">'+o+'</div><div class="card-content"><h3 class="card-name">'+n.author+'</h3><section><p>Email: <a href="mailto:'+n.email+'">'+n.email+"</a></p><p>Date: "+n.date+"</p><p alt='Last Modification Time'>LMT: "+n["last-modification-time"]+'</p></section></div></div><hr class="section-divider"></hr>',t.appendChild(a)}function l(e,t,n){var a=document.createElement("footer"),o='<code class="src src-elisp"><span style="color: #c5c8c6;">(</span><span style="color: #b5bd68;">let</span> <span style="color: #8abeb7;">(</span><span style="color: #f0c674;">(</span>editor <span style="color: #8abeb7;"><a href="http://www.gnu.org/software/emacs/">"Emacs"</a></span><span style="color: #f0c674;">)</span><span style="color: #f0c674;">(</span>generator <span style="color: #b5bd68;">(</span>concat <span style="color: #8abeb7;"> <a href="http://orgmode.org/">"Org-mode"</a></span> <span style="color: #8abeb7;">" &amp; "</span> <span style="color: #8abeb7;"><a href="http://nodejs.org/">"Nodejs"</a></span> <span style="color: #8abeb7;">" &amp; "</span> <span style="color: #8abeb7;"> <a href="https://git-scm.com/">"Git"</a></span><span style="color: #b5bd68;">)</span><span style="color: #f0c674;">)</span><span style="color: #f0c674;">(</span>hostor <span style="color: #8abeb7;"><a href="https://github.com/">"Github"</a></span><span style="color: #f0c674;">)</span><span style="color: #8abeb7;">)</span><span style="color: #c5c8c6;">)</span></code>';a.innerHTML='<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png" /></a><br />This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">Attribution-NonCommercial-ShareAlike 4.0 International License</a>.<br />'+o,e.appendChild(a)}function d(e,t,n){if(n.keywords){var a=n.keywords.split(",");if(a&&a.length>0){var o=document.createElement("div"),r=document.getElementById("footnotes");a.forEach(function(e){var t=document.createElement("a");t.href=E+encodeURIComponent(e),t.title="Go to "+e,t.innerHTML=e,o.appendChild(t)}),o.id="tags",t.insertBefore(o,r)}}}function m(e,t,n){function a(e){var t=document.createElement("a");return t.href="#"+e.id,t.innerHTML="#",t}v&&v.call(["h2","h3","h4"],function(e){v.call(document.getElementsByTagName(e),function(e){e.appendChild(a(e))})})}function p(e){var t=document.getElementsByTagName("head")[0],n=location.pathname,a=document.createElement("meta");a.name="theme-color",n.indexOf("articles")>=0?(e.style.borderTop="2px solid #191919",a.content="#191919"):n.indexOf("translation")>=0?(e.style.borderTop="2px solid #ED462F",a.content="#ED462F"):n.indexOf("wiki")>=0&&(e.style.borderTop="2px solid #4285f4",a.content="#4285f4"),t.appendChild(a);var o=document.createElement("a");o.className="return",location.pathname.search(/\/wiki\//i)>=0?o.href="/":o.href="/#!/archive",e.appendChild(o);var r=document.createElement("a");r.href="https://github.com/creamidea/creamidea.github.com/",r.className="github-badge",r.innerHTML='<svg aria-hidden="true" class="octicon octicon-mark-github" height="24" version="1.1" viewBox="0 0 16 16" width="24"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"></path></svg>',e.appendChild(r)}function u(e,t){var n=Math.round((Date.now()-new Date(t.date))/864e5);if(n>365){var a=document.getElementById("table-of-contents"),o=document.createElement("div");o.style.fontSize="16px",o.className="alert alert-warning",o.innerHTML="文章发表于<strong>"+n+"</strong>天前。日期过于久远，请合理参考。<br />This article was created at <strong>"+n+"</strong> days ago. It is too long, so please pay more attention.",e.insertBefore(o,a)}}function h(e,t){var n=document.createElement("img"),a=e.getAttribute("data-src");n.onerror=function(){console.log("Lazy load image error.")},n.onload=function(){e.parent?e.parent.replaceChild(n,e):e.src=a,e.className="",t?t():null},n.src=a}function f(e){for(var t=0;t<e.length;t++)i(e[t])&&h(e[t],function(){e.splice?e.splice(t,t):null})}function g(t){var n=[];n=t.querySelectorAll?t.querySelectorAll("img[lazy-load]"):b.call(t.getElementsByTagName("img"),function(e){return!!e.hasAttribute("lazy-load")}),e.hasOwnProperty("touchmove")?o(e,"touchmove",function(){f(n)}):o(e,"scroll",function(){f(n)}),f(n)}function y(){var e=document.createElement("div");e.innerHTML='<p>Oops! Your browser is too outmoded. Would you please try the lastest <a href="https://www.google.com/chrome/">Chrome</a>?</p>',e.style.textAlign="center",e.style.background="#ed462f",e.style.color="white",e.style.padding="4px",e.style.fontSize="20px",document.getElementsByTagName("body")[0].insertBefore(e,document.getElementById("content"))}var v=Array.prototype.forEach,b=(Array.prototype.slice,Array.prototype.filter),E="https://cse.google.com/cse/publicurl?cx=017951989687920165329:0e60irxxe5m&hl=en&q=";!function(){for(var a=!1,i=["DOMContentLoaded","load"],h=(e.location.pathname,document.getElementsByTagName("body")[0]),f=document.getElementById("content"),b=c(!1),E=0,T=i.length;E<T;E++){var L=i[E];o(e,L,function(){a||(a=!0,p(h),u(f,b),d(h,f,b),l(h,f,b),m(h,f),s(h,f,b),"undefined"==typeof v?y():(g(f),n(h,f)),t(f,document.getElementById("#outline_disqus_thread")),r(e,L,function(){}))},!1)}}()}(this);