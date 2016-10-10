"use strict"

function parseFilename (filename) {
  const index = filename.lastIndexOf('.')
  return [filename.slice(0, index), filename.slice(index+1)]
}

function onreadystatechange(httpRequest, resp, callback) {
  if (httpRequest.readyState === XMLHttpRequest.DONE) {
    if (httpRequest.status === 200) {
      callback(httpRequest.responseText);
    } else {
      callback('There was a problem with the request.');
    }
  }
}

const Loader = {
  js: function (filename, callback) {
    var script = document.createElement('script')
    script.async = true
    script.src = filename
    script.onload = callback
    return script
  },
  css: function (filename, callback) {
    var link = document.createElement('link')
    link.ref = "stylesheet"
    link.href = filename
    link.onload = callback
    return link
  },
  xhr: function (type='GET', url, beforeReq, afterReq) {
    const httpRequest = new XMLHttpRequest()
    if (!httpRequest) {
      console.error('Giving up :( Cannot create an XMLHTTP instance');
      return false;
    }
    httpRequest.onreadystatechange = (resp) => {
      const readyState = resp.readyState;
      debugger
      if (readyState === 0) {
        // Client has been created. open() not called yet.
      } else if (readyState === 1) {
        // open() has been called.
      } else if (readyState === 2) {
        // send() has been called, and headers and status are available.
        beforeReq()
      } else if (readyState === 3) {
        // Downloading; responseText holds partial data.
      } else if (readyState === 4) {
        switch (resp.status) {
        case 200:
          afterReq(null, resp.responseText)
          break;
        default:
          afterReq(null, resp.responseText)
        }
      }
    }
    httpRequest.open(type, url)
    httpRequest.send()
  },
  txt: function (filename, callback) {
    this.xhr('GET', filename, callback)
  }
}

function preLoader (filename, beforeReq, afterReq) {
  const [name, ext] = parseFilename(filename)
  var elt
  if (['js', 'css'].indexOf(ext) > 0) beforeReq()
  try {
    elt = Loader[ext](filename, afterReq)
  } catch (err) {
    Loader.xhr('GET', filename, beforeReq, afterReq)
    return false
  }
  const head = document.querySelector('head')
  head.appendChild(elt)
}

module.exports = preLoader
