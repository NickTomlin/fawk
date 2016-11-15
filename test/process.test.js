'use strict'

let test = require('ava').test
let process = require('../src/process')

test('replacing input with delimiter', t => {
  let input = 'tab0\ttab1\ttab2'
  let expression = '$1!'

  t.is(process(input, expression), 'tab0!')
})

test('includes special variables like $0', t => {
  let input = 'tab0\ttab1'
  let expression = 'The whole enchilada: $0 and time'

  t.is(process(input, expression), 'The whole enchilada: tab0 tab1 and time')
})

test('allows for a mix', t => {
  let input = 'tab0\ttab1'
  let expression = 'The whole enchilada: $0 and time $1'

  t.is(process(input, expression), 'The whole enchilada: tab0 tab1 and time tab0')
})
