---
layout: docs
title: Hello, world
subtitle: 此站点设计和部分说明
categories: blog
tags: helloworld design
---

很高兴你能看我的第一篇文章，虽然以前也写过一些东西，但是始终觉得只是小打小闹，没有任何技术blog的意味，一度让我不知所错。而这次在github上搭建的blog可以说是一个时代的结束，一个全新的开始。虽然我现在还是不知道如何写出一篇高质量的blog，但是我还是想先写一篇: Hello, world.

## 搭建此博客的目的
其实我很早以前就想开始写自己的博客，可是却不知道如何写博客，就算写了一些东西，最后给我的感觉是笔记而不是博客，一堆知识的堆叠，没有层次，没有目的。于是对于写blog这件很具有挑战性的活动渐渐失去了兴趣。
然而我看到我的战友[van9ogh][]每月坚持写博客，积累了许多的的知识。很是羡慕，很想自己写。但是每次都是由于种种原因和自身的懒惰，都只能作罢。
但是现在是寒假休假时间，在家“无聊”时开始Jekyll静态网站的搭建感觉这个真是一个很有意思的事情。

[van9ogh]: http://forestgump.me

## 此博客的整体设计
### 设计哲学 ###
哲学这个词写出来感觉像是在吓唬人，不过请原谅我这么称呼。设计的总体上是[K.I.S.S](http://en.wikipedia.org/wiki/KISS_principle)(Keep It Simple, Stupid)原则。如同这些blog站点：[au9ustine][], [van9ogh][], [Kylexlau][], [Pradeep Nayak][], [Enrmarc][], [Steve Losh][]等等。但是我感觉最后的成品给人的感觉是很重的。不过看到那些别人精心设计的CSS样式时又不舍得丢弃，于是最后就变成这个样子了。这个是现阶段的产物，一种玩的心态吧，看到有趣的就想加入，最后显得很臃肿。而且现在这年龄还是不想那么正式，严肃中带着些许幽默，这就是我现在想达到的效果。不过我还是让其能够尽量保持简洁。在这其中我更为注重的是**文章**这个版面的设计，如果你感觉我这个版面设计的有碍于阅读一定要告诉我。{% include comments_email.html %}
提出的意见可以是文章背景色，字体的大小颜色，标题和正文的大小颜色等等，总之就是你认为适合阅读的字体颜色大小和对比度的布局设计。谢谢。

[Kylexlau]: http://kyle.xlau.org/

[Steve Losh]: http://stevelosh.com/

[Enrmarc]: http://enrmarc.github.com/index.htm

[Pradeep Nayak]: http://pradeepnayak.in/

[au9ustine]: http://au9ustine.github.com/

### 设计的局部细节 ###
#### Jekyll搭建 ####
我记得我一年前就开始尝试搭建Jekyll的站点，当时想写blog，但是最终也只是尝试了一下，使用了[Octopress][]来搭建的。不过现在已经被我删除了。全新的站点如同现在所示。
Jekyll的搭建过程，网络上已经有许多的高手写的很详细了，我在这里就不再继续累述了，只是将我搭建过程中参考的网站地址给出：

> ##### 中文版 #####
> 1. [像黑客一样写博客——Jekyll入门](http://www.soimort.org/posts/101/)
> 2. [使用Github Pages建独立博客](http://beiyuu.com/github-pages/)
> 
> ##### English Version #####
> 1. [Jekyll Documents](https://github.com/mojombo/jekyll/wiki)
> 2. [Building Static Sites with Jekyll](http://net.tutsplus.com/tutorials/other/building-static-sites-with-jekyll/)
> 3. [Jekyll Install](https://github.com/mojombo/jekyll/wiki/install)

[Octopress]: http://octopress.org/

#### 我的blog目录 ####
{% highlight bash %}
~ $ tree -L 2 
.
├── 404.html
├── about
│   └── index.md
├── archive
│   └── index.html
├── categories
│   └── index.html
├── CNAME
├── _config.yml
├── css
├── font
├── img
├── _includes
├── index.html
├── js
├── _layouts
├── _plugins
├── _posts             #The three categories: blog, documents and note
│   ├── blog
│   ├── docs
│   └── note
├── public
├── README.md
├── rss
│   └── index.html
├── _site
├── tags
│   └── index.html
└── test                #Store the test files
{% endhighlight%}
*\*Linux and Unix [tree](http://www.computerhope.com/unix/tree.htm) Command*

*\*You can use below command to list directory tree listing
(from [One Line Linux Command to Print Out Directory Tree Listing](http://systembash.com/content/one-line-linux-command-to-print-out-directory-tree-listing/))*
{% highlight bash %}
~ $ ls -R | grep ":$" | sed -e 's/:$//' -e 's/[^-][^\/]*\//--/g' \
-e 's/^/ /' -e 's/-/|/'
{% endhighlight%}

#### blog内容(类别)的设计 ####
博客在内容上分为3部分，一个是blog，用来存放写的blog，主要是原创或者80%是原创的文章会被定义为blog；一个是note，用来存放写的笔记，如一些练习题目的练习题，翻译的英文文章，有趣的Linux命令使用等等；最后一个是docs，如果有软件开发的话，这里就是存放的该软件的说明文档。

本来想写一个类别(Categories)的页面，但是赶在农历贰零壹贰年拾贰月廿九日前上传github，所以这个暂时不做了，如果更新了会在本文的末尾写上更新时间。

#### blog标签系统(Tag-Cloud)的设计 ####
完成了Tag-Cloud(Simple)，在每篇文章的右侧会列出该文章被标记的标签，单击其中一个标签，显示该标签包含的文章。这个标签的来源：[Jekyll-tagcloud](http://enrmarc.github.com/blog/Jekyll-tagcloud/)
不过我设计的页面有些许寒酸，如果你有什么好的建议或者意见可以告诉我，谢谢。{% include comments_email.html %}

#### blog中使用的Icons ####
我本来是想使用Github的全套图标的[Github Icons][]，但是感觉那个字体[Octicons-regular](https://github.com/blog/1135-the-making-of-octicons)始终无法正常使用，如果你知道如何使用[Github Icons][]的话，希望能够告诉我，不胜感激啊。{% include comments_email.html %}

后来找了一个替代的Icons: [Awesome Icons](http://fortawesome.github.com/Font-Awesome/)，使用起来相当的简单，而且效果不错。

当然你也可以使用[Bootstrap][]中使用[Glyphicons Icons](http://glyphicons.com/)，设计的也是相当的不错。

[Github Icons]: https://github.com/styleguide/css/7.0

[Bootstrap]: http://twitter.github.com/bootstrap/

#### blog中搜索引擎 ####
此次blog中搜索的设计的想法是使用[Google Custom Search Engine][]，可能受到网络的原因以及其他未知的原因，实际效果可能不是很理想，但是Google搜索是很强大，我还是决定先试用一段时间。还有一个原因就是现在能力有限，实现的搜索引擎也是不尽如人意，所以觉得暂缓搜索引擎的开发，等待时机成熟时再来尝试。

期间我也看到了一些Jekyll站点使用自己的搜索，比如下面的站点：

> 1. [Search for your Jekyll Site](http://pradeepnayak.in/technology/2012/06/20/search-for-your-jekyll-site/)
> 2. [为Jekyll添加静态搜索](http://kingauthur.info/2012/12/03/the-things-about-jekyll/)

有空的时候会自己设计搜索，如果你有什么好的想法或者想和我一起研究的，可以{% include comments_email.html %}

[Google Custom Search Engine]: https://www.google.com/cse/

#### blog分享 ####
1. [豆瓣收藏秀](http://www.douban.com/service/badgemakerjs)

#### blog中的一些快捷功能 ####
在阅读文章时可以使用左，右键（或J,j,K,k键）来翻看前一篇，后一篇文章。

在任何页面的快捷键:H->Home, A->About, R->RSS, Esc->Archive.

## 致Emacser： Markdown-Mode ##
使用Emacs来写blog真的是一件不错的事情，当使用[Jason Blevins](http://jblevins.org/)写的[markdown-mode.el](http://jblevins.org/projects/markdown-mode/markdown-mode.el)来写Markdown时就更加是如虎添翼。其官方文档是[Emacs Markdown Mode](http://jblevins.org/projects/markdown-mode/)，EmaceWiki中的文档是[MarkdownMode](http://emacswiki.org/emacs/MarkdownMode)。

##### Markdonw 参考文档 #####

> *繁文版:*
>
> 1. [Markdown: Syntax](http://markdown.tw/#blockquote)
> 
> *English Version:*
> 1. [Markdown: Syntax](http://daringfireball.net/projects/markdown/syntax)
> 2. [Improving Wiki Editing with Markdown](http://blog.markdownwiki.com/)

*致Vimer, 不好意思，这里暂时不提供vim的markdown-mode， 我相信你们也可以自行搜索到，我现在暂时使用Emacs，虽然Vim也是我喜欢的编辑器。*

## 结尾 ##
非常感谢你能够阅读到最后，以上只是我在这次blog设计中考虑到的一些问题，如果还有一些细节我没有考虑到，希望你能指出{% include comments_email.html%}，我将及时修正。

这里我将记录学习、学术时的文章，主要记录自己在学习人类文化和科技时的部分过程和经历。如果想知道我看过哪些书，电影或者听过哪些音乐，了解我的另一面，请移步[我的豆瓣](http://www.douban.com/people/creamidea/)。
