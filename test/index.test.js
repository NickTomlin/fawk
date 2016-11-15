'use strict'

let test = require('ava').test
let fawk = require('../index')

test('processes input', t => {
  let args = ['$0', '--append', ';', '--unless', '/bad/']

  t.is(fawk('hello', args), 'hello;')
  t.is(fawk('bad hello', args), 'bad hello')
})

test('does all the tings', t => {
  let args = ['The whole enchillada: $line and time $1', '--append', ';', '--unless', '/bad/']
  let input = 'tab0\ttab1\ttab2' // todo, something that splits input from args

  t.is(fawk(input, args), 'The whole enchillada: tab0 tab1 tab2 and time tab1;')
})
