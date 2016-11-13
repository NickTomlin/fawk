#!/usr/bin/env node

let read = require('fs').readFileSync

function append (line, toAppend) {
  return source + toAppend
}

function nawkIf (line, condition) {
  return
}

function unless (line, condition) {
  return !nawkIf(line, condition)
}

function contains (line, condition) {
  return line.indexOf(condition) > -1
}

const flags = {
  append: {
   fn: append,
   type: 'command'
  },
  if: {
    fn: nawkIf,
    type: 'condition'
  },
  unless: {
    fn: unless,
    type: 'condition'
  }
}


let args = process.argv.slice(2)
let len = args.length
let i = 0
// a command can have many conditions
// we can only have one command at a time
let fns = []
let command = false
let condition = false
let conditions = []
let commandArgs = []
let conditionArgs = []

while (i < len) {
  let arg = args[i]
  let argIndex = arg.indexOf('--')
  console.log(arg)
  if (argIndex == 0) {
    let flagName = arg.slice(argIndex + 2)
    let flag = flags[flagName]
    if (flag && flag.type === 'command') {
      console.log('cmd')
      if (command) {
        // we want conditions to run before the command
        fns.push(
          conditions.push(command)
        )
        command = false
      } else {
        console.log('null')
        command = flag.fn
      }
    } else if (flag && flag.type === 'condition') {
      if (!command) {
        throw new Error(`Condition ${flagName} given without a command`)
      }
      condition = true
    } else {
      throw new Error(`Unrecognized option ${flagName}`)
    }
  }

  if (command) {
    commandArgs.push(arg)
  } else if(condition) {
    conditionArgs.push(arg)
  }

  i++
}
