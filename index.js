'use strict'

let flags = require('./src/commands')
let process = require('./src/process')
let parseArgs = require('./src/parse-args')
let reifyCommands = require('./src/reify-commands')

function fawk(input, argv) {
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

module.exports = fawk
