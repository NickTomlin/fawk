'use strict'

let delims = {
  'tab': '\t'
}

function templateify (expression, context) {
  return expression.replace(/\$\w+/g, (match) => {
    return context[match] ? context[match] : match
  })
}

function process (input = '', expression, delim = 'tab') {
  let columns = input.split(delims[delim])
  let context = columns.reduce((accum, item, index) => {
    accum[`$${index + 1}`] = item
    return accum;
  }, {
    // "special" globals on context
    '$0': columns.join(' ')
  })

  return templateify(expression, context)
}

module.exports = process
