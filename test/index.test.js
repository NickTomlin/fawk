let test = require('ava').test
let flags = require('../src/commands')
let process = require('../src/process')
let parseArgs = require('../src/parse-args')
let reifyCommands = require('../src/reify-commands')

function main(input, argv) {
  let [expression, ...args] = argv
  let [tree, options] = parseArgs(args)
  let commands = reifyCommands(tree)
  let processedLine = process(input, expression)

  return commands.reduce((accum, command) => {
    if (command.conditions.every((f) => {
      return f.fn(processedLine)
    })) {
      return command.fn(processedLine)
    } else {
      return input
    }
  }, '')
}

test('processes input', t => {
  let args = ['$0', '--append', ';', '--unless', '/bad/']

  t.is(main('hello', args), 'hello;')
  t.is(main('bad hello', args), 'bad hello')
})

test('does all the tings', t => {
  let args = ['The whole enchillada: $line and time $1', '--append', ';', '--unless', '/bad/']
  let input = 'tab0\ttab1\ttab2' // todo, something that splits input from args

  t.is(main(input, args), 'The whole enchillada: tab0 tab1 tab2 and time tab1;')
})
