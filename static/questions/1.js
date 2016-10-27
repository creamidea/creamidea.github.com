var accuracy = 6
// e^(ix) = cos(x) + i*sin(x)
function EulerFormula (x) {
  return {
    re: +(Math.cos(x).toFixed(accuracy)),
    im: +(Math.sin(x).toFixed(accuracy) /*i*/)
  }
}

// console.log(EulerFormula(Math.PI))
// console.log(EulerFormula(2 * Math.PI))
// console.log(EulerFormula(Math.pow(Math.PI, 2)))

onmessage = function (oEvent) {
  var answer = oEvent.data.answer
  var result = false

  var complex = answer.split('+')
  var A = {
    re: +complex[0] - 1,
    im: +complex[1] || 0
  }

  var B = (EulerFormula(Math.PI))
  if (A.re === B.re && A.im === B.im) result = true

  postMessage({
    result: result,
    answer: answer
  });
}
