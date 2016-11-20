'use strict'

function append (item, input) {
  return input + item
}

function prepend (item, input) {
  return input + item
}

const isRegexRe = /^\/.*\/$/

function nawkIf (arg, input) {
  if (isRegexRe.test(arg)) {
    arg = arg.slice(1, arg.length - 1)
  }

  // leave it open for interpolated conditions later maybe?
  return new RegExp(arg).test(input)
}

function unless (arg, input) {
  return !nawkIf(arg, input)
}

const commands = {
  append: {
    type: 'command',
    fn: append
  },
  prepend: {
    type: 'command',
    fn: append
  },
  if: {
    type: 'condition',
    fn: nawkIf
  },
  unless: {
    type: 'condition',
    fn: unless
  }
}

module.exports = commands
