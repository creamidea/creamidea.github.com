/**
   example
   *******

var alertTips = AlertTips({disabled: true})
initAnalytics (function () {
  // before load
}, function (tracker) {
  // after load
  var clientId = tracker.get('clientId')
  alertTips.show('Hi, you have connected with Google successfully.')
  alertTips.show('Your CLIENT ID: ' + clientId)
})
*/


function AlertTips (opt) {
  opt = opt || {}
  var interval = IntervalTimer(10000) // 3s do it
  var isStop = true
  var div = document.createElement('div')
  div.id = 'history-tips'
  document.body.appendChild(div)
  var o = {
    end: function () {
      this.count = 0
      isStop = true
      console.log('[Alert Tips] The time is out.')
    },
    every: function () {
      div.removeChild(div.firstChild)
    },
    count: 0
  }

  return {
    show: function (message) {
      if (isStop && !opt.disabled) {
        interval.start(o)
        isStop = false
      }
      var p = document.createElement('p')
      p.innerHTML = message
      o.count += 1
      div.appendChild(p)
    }
  }
}

/**
 * Timer
 * interval @param number default:1s
 *
 * return @param function
 * o @param object
 */
function IntervalTimer (interval) {
  var timer, count = 0
  if (!interval) interval = 1000
  return {
    start:function (o) {
      if (isNaN(o.count) && o.count > 0) {
        console.log('[IntervalTimer] The count is invalid. Count: ', o.count)
        return
      }
      timer = setInterval((function () {
        count = count + 1
        if (count > o.count) {
          this.stop()
          if (typeof o.end === 'function') o.end()
        } else {
          if (typeof o.every === 'function') o.every()
        }
      }).bind(this), interval)
    },
    stop: function (){
      clearInterval(timer)
      count = 0
    }
  }
}
