;;; package --- Summary
;;; Commentary:
;; command:
;; $ cd /your/project/path
;; $ emacs -Q -nw --batch -L ~/.emacs.d/elpa/htmlize-20130207.1202 -l org-publish-setting.el -f load-creamidea-site-publish

;; filename: c:/Users/creamidea/Repository/2333/_content/articles/Google-Translate-RESTFUL-API.org::c:/Users/creamidea/Repository/2333/static/html/::org-html-publish-to-html
;; hash: 487caa68ba9c36b3b1d64455db4d6b18df3d1ac2

;;; Code:
;; Commentary: for org-mode project: creamidea

;; (let ((default-directory
;;         (concat user-emacs-directory
;;                 (convert-standard-filename "elpa/"))))
;;   (normal-top-level-add-subdirs-to-load-path))
;; (add-to-list 'load-path "~/path/to/orgdir/contrib/lisp " t)
;; (add-to-list 'load-path "~/.emacs.d/elpa/org-20161003")

(require 'org)
(require 'ox-publish)
;; (require 'htmlize)
;; (require 'ox-rss)

(setq site-project-path (expand-file-name "~/Repository/creamidea.github.io/"))

(defun org-html--wrap-image (contents info &optional caption label)
  "Wrap CONTENTS string within an appropriate environment for images.
INFO is a plist used as a communication channel.  When optional
arguments CAPTION and LABEL are given, use them for caption and
\"id\" attribute."
  (let ((html5-fancy (org-html--html5-fancy-p info)))
    (format (if html5-fancy "\n<figure%s>%s%s\n</figure>"
	      "\n<div%s class=\"figure\">%s%s\n</div>")
	    ;; ID.
	    (if (org-string-nw-p label) (format " id=\"%s\"" label) "")
	    ;; Contents.
            (if (plist-get info :html-image-lazy-load)
                (format "\n<p class=\"lazy-load-img-wrapper\">%s</p>" contents)
              (format "\n<p>%s</p>" contents))
	    ;; Caption.
	    (if (not (org-string-nw-p caption)) ""
	      (format (if html5-fancy "\n<figcaption>%s</figcaption>"
			"\n<p>%s</p>")
		      caption)))))

(defmacro org-html-make-attribute-macro (src)
  "Return macro org-html--make-attribute-string.
SRC."
  `(org-html--make-attribute-string
    (org-combine-plists
     (list ,src source
           :alt (if (string-match-p "^ltxpng/" source)
                    (org-html-encode-plain-text
                     (org-find-text-property-in-string 'org-latex-src source))
                  (file-name-nondirectory source)))
     attributes)))
(defmacro org-html-close-tag-img-macro (attr)
  "Return.
ATTR."
  `(org-html-close-tag
    "img"
    ,attr
    info))

(defun org-html--format-image (source attributes info)
  "Return \"img\" tag with given SOURCE and ATTRIBUTES.
SOURCE is a string specifying the location of the image.
ATTRIBUTES is a plist, as returned by
`org-export-read-attribute'.  INFO is a plist used as
a communication channel."
  (if (string= "svg" (file-name-extension source))
      (org-html--svg-image source attributes info)
    (let ((normal-img-attr (org-html-make-attribute-macro :src))
          (lazy-load-img-attr
           (format "lazy-load %s"
                   (org-html-make-attribute-macro :data-src))))
      (if (plist-get info :html-image-lazy-load)
          (format
           "<noscript>%s</noscript>%s"
           (org-html-close-tag-img-macro normal-img-attr)
           (org-html-close-tag-img-macro lazy-load-img-attr))
        (org-html-close-tag-img-macro normal-img-attr)))))

;; (defun after-publishing (in out)
;;   "after-publishing"
;;   (message "o-p-a-p-h in: '%s' out: '%s'" in out))
;; (add-hook 'org-publish-after-publishing-hook 'after-publishing)

(defun creamidea-site-setting (current-or-all &optional force async)
  "Configure for Creamidea-Site.
CURRENT-OR-ALL FORCE ASYNC."
  (interactive)
  (let* ((creamidea-path site-project-path)
         (creamidea-public-path (concat creamidea-path "./static/html/"))
         (author-info "<div id=\"meta-article\"><p class=\"author\">%a</p>\n<p class=\"email\">%e</p>\n<p class=\"date\">%d</p>\n<p class=\"export-date\">%T</p>\n<p class=\"creator\">%c</p>\n<p class=\"validation\">%v</p>\n<p class=\"last-modification-time\">%C</p></div>")
         (meta-viewport "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">")
         (link-medium-fonts "<link rel=\"stylesheet\" type=\"text/css\" href=\"/static/medium-fonts.css\">")
         (link-style-css "<link rel=\"stylesheet\" type=\"text/css\" href=\"/static/article.css\">")
         (html5shiv "<!--[if lt IE 9]>\n<script src=\"/static/libs/html5shiv.min.js\"></script>\n<![endif]-->")
         (app-js "<script src=\"/static/article.js\"></script>")
         (analytics-js "<!-- Google Analytics --><script>(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');ga('create', 'UA-38213594-1', 'auto');ga('send', 'pageview');</script><!-- End Google Analytics -->")

         (org-link-abbrev-alist
          '(("static-img"  . "../../img/%s")
            ("glfs" . "https://media.githubusercontent.com/media/creamidea/creamidea.github.com/master/static/lfs/%s")
            ("glfs-img" . "https://media.githubusercontent.com/media/creamidea/creamidea.github.com/master/static/img/%s")
            ("gdraw". "https://docs.google.com/drawings/d/")
            ("url-to-ja" . "http://translate.google.fr/translate?sl=en&tl=ja&u=%h")
            ("google"    . "http://www.google.com/search?q=")
            ("gmap"      . "http://maps.google.com/maps?q=%s")
            ("omap"      . "http://nominatim.openstreetmap.org/search?q=%s&polygon=1")
            ("ads"       . "http://adsabs.harvard.edu/cgi-bin/nph-abs_connect?author=%s&db_key=AST")))

         (org-html-doctype "html5")
         (org-html-html5-fancy t)
         (org-export-html-coding-system "utf-8")
         (org-html-with-latex "mathjax")
         (org-src-fontify-natively t)
         (org-html-mathjax-template
          "<script type=\"text/x-mathjax-config\">
          MathJax.Hub.Config({
            displayAlign: \"%ALIGN\",
            displayIndent: \"%INDENT\",

            \"HTML-CSS\": { scale: %SCALE,
                        linebreaks: { automatic: \"%LINEBREAKS\" },
                        webFont: \"%FONT\"
                          },
            SVG: {scale: %SCALE,
              linebreaks: { automatic: \"%LINEBREAKS\" },
              font: \"%FONT\"},
            NativeMML: {scale: %SCALE},
            TeX: { equationNumbers: {autoNumber: \"%AUTONUMBER\"},
               MultLineWidth: \"%MULTLINEWIDTH\",
               TagSide: \"%TAGSIDE\",
               TagIndent: \"%TAGINDENT\"
                 }
          });</script><script async type=\"text/javascript\" src=\"%PATH\"></script>")

         ;; (org-html-mathjax-options
         ;;  '((path "http://www.baidu.com")))

         (org-publish-timestamp-directory (concat creamidea-path ".org-timestamps/"))

         ;; (org-export-in-background t)
         ;; (org-export-async-init-file (concat creamidea-path "org-publish-setting.el"))
         ;; (org-export-async-debug t)
         ;; (org-html-htmlize-output-type 'css)

         (org-publish-project-alist
          `(
            ;; 把各部分的配置文件写到这里面来
            ("creamidea-article"
             :publishing-directory ,creamidea-public-path
             :base-directory ,(concat creamidea-path "_content/")
             :base-extension "org"
             :exclude "README.org" ;; regexp
             :recursive t
             :publishing-function org-html-publish-to-html
             :headline-levels 4   ; Just the default for this project.
             :html-head ,(concat link-style-css html5shiv)
             :auto-preamble t
             ;; :html-preamble ,meta-viewport
             :html-postamble ,(concat author-info app-js analytics-js)
             :html-extension "html"
             :html-head-include-default-style nil
             :html-head-include-scripts nil
             :html-image-lazy-load t
             :section-numbers t
             ;; :body-only: t
             ;; :author "冰糖火箭筒(Junjia Ni)"
             ;; :email "creamidea@gmail.com"
             ;; :auto-sitemap t   ; Generate sitemap.org automagically...
             ;; :sitemap-filename "sitemap.org" ; ... call it sitemap.org (it's the default)...
             ;; :sitemap-title "c-tone"    ; ... with title 'Sitemap'.
             ;; :sitemap-function org-publish-org-sitemap
             ;; :sitemap-sort-files anti-chronologically
             ;; :sitemap-file-entry-format "%t %d"
             )
            ("creamidea-static"
             :base-directory ,(concat creamidea-path "static/")
             :base-extension "css\\|js\\|png\\|jpg\\|gif\\|pdf\\|mp3\\|ogg\\|swf\\|html"
             :publishing-directory  ,creamidea-public-path
             :recursive nil
             :publishing-function org-publish-attachment
             )
            ("creamidea-rss"
             :base-directory ,(concat creamidea-path "_content/")
             :base-extension "org"
             :rss-image-url "http://creamidea.github.io/favicon.ico"
             :html-link-home "http://creamidea.github.io/"
             :html-link-use-abs-url t
             :publishing-directory ,creamidea-public-path
             :publishing-function (org-rss-publish-to-rss)
             :rss-extension "xml"
             :section-numbers nil
             :exclude ".*"            ;; To exclude all files...
             :include "index.org"   ;; ... except index.org.
             :table-of-contents nil
             )
            ("creamidea-site" :components ("creamidea-article"))
            ;; ("creamidea" :components ("creamidea-article" "creamidea-static"))
            ;; http://lujun9972.github.io/emacs/elisp/
            ;; http://forrestchang.github.io/2015/08/29/use-emacs-org-mode-build-blog/
            )))
    ;; This slows down org-publish to a crawl, and it is not needed since
    ;; I use magit anyway.
    ;; (remove-hook 'find-file-hooks 'vc-find-file-hook)
    ;; (global-set-key (kbd "C-c x") (lambda () (interactive) (org-publish-current-project nil t)))
    ;; (global-set-key (kbd "C-c x") 'org-publish-project)
    ;; (org-publish-file "C:/Users/creamidea/Repository/2333/_content/articles/Google-Translate-RESTFUL-Api.org")
    ;; (message (format "%s %s" current-or-all (string= current-or-all "current")) )
    (cond ((string= current-or-all "all") (org-publish-project "creamidea-site" force async))
          (t (org-publish-current-file)))
    ))

(defun publish-creamidea-site ()
  "Publish Site."
  (interactive)
  (if (yes-or-no-p "Do you want to publish creamidea-site forcely?")
      (creamidea-site-setting "all" t)
    (creamidea-site-setting "all"))
  (build-archive))

(defun build-archive ()
  "Build Archive."
  (interactive)
  ;; (call-process "pwd" nil t)
  (let ((cmd-js (concat site-project-path "export.js" ))
        (add-file (buffer-file-name (window-buffer (minibuffer-selected-window)))))
    ;; (switch-to-buffer-other-window "*Build Archive Message*")
    (shell-command-to-string (format "node %s archive" cmd-js))
    (shell-command-to-string (format "node %s add %s /" cmd-js add-file))))

;; (global-set-key (kbd "C-c x") 'load-creamidea-site-publish)
(global-set-key
 (kbd "C-c x")
 (lambda ()
   (interactive)
   (creamidea-site-setting "current")
   (build-archive)))
;; (global-set-key (kbd "C-c x 2")
;;                 (lambda () (interactive) (publish-creamidea-site "all" t)))
;; (progn
;;   (profiler-start 'cpu)
;;   (load-creamidea-site-publish)
;;   (profiler-report))

(provide 'org-publish-setting)
;;; org-publish-setting.el ends here

;; Local Variables:
;; coding: utf-8
;; no-byte-compile: t
;; End:
