;;; package --- Summary
;;; Commentary:
;; command:
;; $ cd /your/project/path
;; $ emacs -Q -nw --batch -L ~/.emacs.d/elpa/htmlize-20130207.1202 -l org-publish-setting.el -f load-creamidea-site-publish

;;; Code:
;; Commentary: for org-mode project: creamidea

(require 'ox-publish)
(require 'htmlize)

;; (defun after-publishing (in out)
;;   "after-publishing"
;;   (message "o-p-a-p-h in: '%s' out: '%s'" in out))
;; (add-hook 'org-publish-after-publishing-hook 'after-publishing)

(defun load-creamidea-site-publish ()
  "Configure for Creamidea-Site."

  (let* ((creamidea-path (expand-file-name "./_content/"))
         (creamidea-public-path (expand-file-name "./static/html/"))
         (author-info "<div id=\"meta-article\"><p class=\"author\">%a</p>\n<p class=\"email\">%e</p>\n<p class=\"date\">%d</p>\n<p class=\"export-date\">%T</p>\n<p class=\"creator\">%c</p>\n<p class=\"validation\">%v</p>\n<p class=\"last-modification-time\">%C</p></div>")
         (link-medium-fonts "<link rel=\"stylesheet\" type=\"text/css\" href=\"/static/medium-fonts.css\">")
         (link-style-css "<link rel=\"stylesheet\" type=\"text/css\" href=\"/static/app.css\">")
         (analytics-js "<!-- Google Analytics --><script>window.ga=window.ga||function(){(ga.q=ga.q||[]).push(arguments)};ga.l=+new Date;ga('create', 'UA-38213594-1', 'auto');ga('send', 'pageview');</script><script async src='//www.google-analytics.com/analytics.js'></script><!-- End Google Analytics -->")
         (app-js "<script asyn src=\"/static/app.js\"></script>")

         (org-link-abbrev-alist
          '(("static-img"  . "../static/img/reference/%s")
            ("glfs" . "https://media.githubusercontent.com/media/creamidea/creamidea.github.com/master/static/lfs/%s")
            ("gdraw". "https://docs.google.com/drawings/d/")
            ("url-to-ja" . "http://translate.google.fr/translate?sl=en&tl=ja&u=%h")
            ("google"    . "http://www.google.com/search?q=")
            ("gmap"      . "http://maps.google.com/maps?q=%s")
            ("omap"      . "http://nominatim.openstreetmap.org/search?q=%s&polygon=1")
            ("ads"       . "http://adsabs.harvard.edu/cgi-bin/nph-abs_connect?author=%s&db_key=AST")))

         (org-publish-project-alist
          `(
            ;; 把各部分的配置文件写到这里面来
            ("creamidea-article"
             :base-directory ,creamidea-path
             :publishing-directory ,creamidea-public-path
             ;; :base-directory ,(concat creamidea-path "_articles/")
             :base-extension "org"
             :recursive t
             :publishing-function org-html-publish-to-html
             :headline-levels 4             ; Just the default for this project.
             :html-head ,link-style-css
             :auto-preamble t
             ;; :html-preamble ,(concat app-js analytics-js)
             :html-postamble ,(concat author-info app-js analytics-js)
             :html-extension "html"
             :html-head-include-default-style nil
             :html-head-include-scripts nil
             :section-numbers t
             ;; :body-only: t
             :async-export t
             ;; :author "冰糖火箭筒(Junjia Ni)"
             ;; :email "creamidea@gmail.com"
             :auto-sitemap t                ; Generate sitemap.org automagically...
             :sitemap-filename "sitemap.org"  ; ... call it sitemap.org (it's the default)...
             :sitemap-title "c-tone" ; ... with title 'Sitemap'.
             :sitemap-function org-publish-org-sitemap
             :sitemap-sort-files anti-chronologically
             :sitemap-file-entry-format "%t %d"
             :org-html-doctype-alist html5
             )
            ("creamidea-static"
             :base-directory ,(concat creamidea-path "static/")
             :base-extension "css\\|js\\|png\\|jpg\\|gif\\|pdf\\|mp3\\|ogg\\|swf\\|html"
             :publishing-directory  ,creamidea-public-path
             :recursive nil
             :publishing-function org-publish-attachment
             )
            ("homepage-rss"
             :base-directory ,(concat creamidea-path "_content/")
             :base-extension "org"
             :publishing-directory ,creamidea-public-path
             :publishing-function (org-rss-publish-to-rss)
             :html-link-home "http://creamidea.github.io/"
             :html-link-use-abs-url t)
            ;; :rss-image-url "http://creamidea.github.io/favicon.ico"
            ;; :rss-extension "xml"
            ;; :section-numbers nil
            ;; :exclude ".*"            ;; To exclude all files...
            ;; :include "index.org"   ;; ... except index.org.
            ;; :table-of-contents nil
            ("creamidea-site" :components ("creamidea-article"))
            ;; ("creamidea" :components ("creamidea-article" "creamidea-static"))
            ;; http://lujun9972.github.io/emacs/elisp/
            ;; http://forrestchang.github.io/2015/08/29/use-emacs-org-mode-build-blog/
            )))
    ;; This slows down org-publish to a crawl, and it is not needed since
    ;; I use magit anyway.
    ;; (remove-hook 'find-file-hooks 'vc-find-file-hook)
    (global-set-key (kbd "C-c x") 'org-publish-current-project)
    (org-publish-project "creamidea-site")))
;; (require 'ox-rss)
;; C-h v org-html-postamble-format

;; (load-creamidea-site-publish)
;; (progn
;;   (profiler-start 'cpu)
;;   (load-creamidea-site-publish)
;;   (profiler-report))

(provide 'org-publish-setting)
;;; org-publish-setting.el ends here
