"use strict"

let lettles = []
!function () {
  let storage = []
  for (let i = 65, max = 65 + 25 + 7 + 26; i < max; i++) {

    if (i > 90 && i < 97) continue // [ \ ] ^ _ `

    lettles[String.fromCharCode(i)] = [{
      sym: `\\x${(i).toString(16)}`,
      type: 'hex'
    }]
    // storage.push(`${String.fromCharCode(i)}: '\\x${(i).toString(16)}'`)
  }
  // console.log(storage.join(','))
}()

// Object.keys(table).forEach(lettle => {
//   lettles[lettle] = [{
//     sym: table[lettle]
//   }]
// })

function parse (string, symbol) {
  string.split('').forEach( (value, index) =>{

    // if (!(/[a-zA-Z]/.test(value))) return

    if (!lettles[value]) lettles[value] = []

    lettles[value].push({
      sym: symbol,
      pos: index
    })

  })
}

function random (max = 10) {
  if (max <= 0) return 0
  else return Math.ceil(Math.random() * 1000 % max)
}

function generate (target) {
  return target.split('').map( value => {
    // let flag = false
    // if (/[A-Z]/.test(value)) flag = true
    // let a = lettles[ random(2) > 1 ? value.toLowerCase() : value ]

    let a = lettles[value]
    if (!a) return `[unfound:${value}]`

    a = a[random(a.length - 1)]
    // console.log(a.pos, a.sym)

    if (a.type === 'hex') return `'${a.sym}'`

    if (a.pos >= 0) return `(${a.sym})[${a.pos}]`
    else return `${a.sym}`

  }).join('+')
}

function toString36 (sToString, include = []) {
  let end = 36
  while(end > 9) {
    end -= 1
    let lt = end.toString(36)

    if (include.indexOf(lt) < 0) continue

    if (!lettles[lt]) lettles[lt] = []
    // console.log('>>>', end.toString(36))
    lettles[end.toString(36)].push({
      sym: `(${end})[${sToString}](36)`
    })
  }
}

function fromCharCode (sString, sFromCharCode) {
  for (let i = 65, max = 65 + 25; i < max; i++) {

    if (i > 90 && i < 97) continue // [ \ ] ^ _ `

    let lt = String.fromCharCode(i)
    if (!lettles[lt]) lettles[lt] = []
    lettles[lt].push({
      sym: `${sString}.${sFromCharCode}(i)`
    })
  }
}

/**
 * filter the lettle that not be generated
 */
function check () {
  return 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').filter( a => {
    if (lettles[a]) return false
    else return true
  })
}

function init () {
  let sFalse = ![]+"" // f a l s e
  let sTrue = !""+[] // t r u e
  let sUndefined = ""[""]+[] // u n d e f i n e d
  // let sFill = sFalse[0] + sUndefined[5] + sFalse[2] + sFalse[2] // f i l l

  // let sFunction = [][sFalse[0] + sUndefined[5] + sFalse[2] + sFalse[2]]+[] // f u n c t i o n f i l l ( ) { [ n a t i v e c o d e ] }
  // let sNaN = sFalse[0]-1+"" // N a N

  parse(sFalse, '![]+""')
  parse(sTrue, '!""+[]')
  parse(sUndefined, '""[""]+[]')
  let sFill = generate('fill')
  parse('fill', sFill)
  parse([]["fill"]+[], `[][${sFill}]+[]`)

  // let sConstruct = generate('constructor')
  // parse(""["constructor"] + [], `""[${sConstruct}]+""`)
  // parse(true["constructor"] + [], `true[${sConstruct}]+""`)
  // parse(0["constructor"] + [], `0[${sConstruct}]+[]`)
  // parse([]["constructor"] + [], `[][${sConstruct}]+""`)
  // parse(({})["constructor"] + [], `({})[${sConstruct}]+[]`)

  // toString36(generate('toString'), ['C', 'h'])
  // console.log(generate('fromCharCode'))
  // let sToUpperCase = generate('toUppercase')
}
init()

let Aa = '"'
let Bb = '-'
let sEqual = '==='
let sSpace = ' '
let Pa = generate('[')
let Pb = generate(']')
let Qa = generate('(')
let Qb = generate(')')
let sMath1 = generate('Math')
let sCos = generate('cos')
let sMath2 = generate('Math')
let sPI = generate('PI')
let sReturn = generate('return')
let sA = generate('A')
// console.log(sMath1, Pa, Aa)
// console.log('----')
// console.log(sCos, Aa, Pb)
// console.log('----')
// console.log(sMath2, Pa, Aa)
// console.log('----')
// console.log(sPI, Aa, Pb)

console.log('----\n')
// console.log(`${sMath1}+${Pa}+'${Aa}'+${sCos}+'${Aa}'+${Pb}+${Qa}+${sMath1}+${Pa}+'${Aa}'+${sPI}+'${Aa}'+${Pb}+${Qb}`)
// console.log(`var a = [${sMath1}, ${Pa}, '${Aa}', ${sCos}, '${Aa}', ${Pb}, ${Qa}, ${sMath1}, ${Pa}, '${Aa}', ${sPI}, '${Aa}', ${Pb}, ${Qb}]`)
// console.log(generate('return'))
// console.log(generate('if'))
// console.log(generate('a'))
// console.log(`${sA}+'${Bb}1'+'${sEqual}'+${sMath1}+${Pa}+'${Aa}'+${sCos}+'${Aa}'+${Pb}+${Qa}+${sMath1}+${Pa}+'${Aa}'+${sPI}+'${Aa}'+${Pb}+${Qb}`)
console.log(`${generate('console')}+${Pa}+'${Aa}'+${generate('log')}+'${Aa}'+${Pb}+${Qa}+'${Aa}'+${generate('love')}+'${Aa}'+${Qb}`)

// console.log(check())
// console.log(lettles)

// example
// '\x41'+'-1'+'==='+'\x4d'+([][(![]+"")[0]+(""[""]+[])[5]+(![]+"")[2]+(![]+"")[2]]+[])[20]+([][(![]+"")[0]+(""[""]+[])[5]+(![]+"")[2]+(![]+"")[2]]+[])[4]+'\x68'+([][(![]+
// "")[0]+(""[""]+[])[5]+(![]+"")[2]+(![]+"")[2]]+[])[18]+'"'+([][(![]+"")[0]+(""[""]+[])[5]+(![]+"")[2]+(![]+"")[2]]+[])[26]+([][(![]+"")[0]+(""[""]+[])[5]+(![]+"")[2]+(!
// []+"")[2]]+[])[6]+(![]+"")[3]+'"'+([][(![]+"")[0]+(""[""]+[])[5]+(![]+"")[2]+(![]+"")[2]]+[])[30]+([][(![]+"")[0]+(""[""]+[])[5]+(![]+"")[2]+(![]+"")[2]]+[])[13]+'\x4d'
// +([][(![]+"")[0]+(""[""]+[])[5]+(![]+"")[2]+(![]+"")[2]]+[])[20]+([][(![]+"")[0]+(""[""]+[])[5]+(![]+"")[2]+(![]+"")[2]]+[])[4]+'\x68'+([][(![]+"")[0]+(""[""]+[])[5]+(!
// []+"")[2]+(![]+"")[2]]+[])[18]+'"'+'\x50'+'\x49'+'"'+([][(![]+"")[0]+(""[""]+[])[5]+(![]+"")[2]+(![]+"")[2]]+[])[30]+([][(![]+"")[0]+(""[""]+[])[5]+(![]+"")[2]+(![]+"")
// [2]]+[])[14]
