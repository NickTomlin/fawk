'use strict'

let test = require('ava').test
let nawk = require('../index')

test('processes input', t => {
  let args = ['$0', '--append', ';', '--unless', '/bad/']

  t.is(nawk('hello', args), 'hello;')
  t.is(nawk('bad hello', args), 'bad hello')
})

test('handles a an expression and conditions', t => {
  let args = ['The whole enchillada: $0 and time $1', '--append', ';', '--unless', '/bad/']
  let input = 'tab0\ttab1\ttab2'

  t.is(nawk(input, args), 'The whole enchillada: tab0 tab1 tab2 and time tab0;')
})

test('handles commands without conditions', t => {
  let args = ['The whole enchillada: $0 and time $1', '--append', ';']
  let input = 'tab0\ttab1\ttab2'

  t.is(nawk(input, args), 'The whole enchillada: tab0 tab1 tab2 and time tab0;')
})
