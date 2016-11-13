let test = require('ava').test
let process = require('../src/process')

test('replacing input with delimiter', t => {
  let input = 'tab0\ttab1\ttab2'
  let expression = '$1!'

  t.is(process(input, expression), 'tab1!')
})

test('includes special variables like $line', t => {
  let input = 'tab0\ttab1'
  let expression = 'The whole enchilada: $line and time'

  t.is(process(input, expression), 'The whole enchilada: tab0 tab1 and time')
})

test('allows for a mix', t => {
  let input = 'tab0\ttab1'
  let expression = 'The whole enchilada: $line and time $1'

  t.is(process(input, expression), 'The whole enchilada: tab0 tab1 and time tab1')
})
