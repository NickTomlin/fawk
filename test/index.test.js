let test = require('ava').test

// actual functions

function append (item, input) {
  return input + item
}

function prepend (item, input) {
  return input + item
}

function nawkIf (arg, input) {
  // should probably precompile this
  if (/^\/.*\/$/.test(arg)) {
    arg = arg.slice(1, arg.length - 1)
  }

  // leave it open for interpolated conditions later maybe?
  return new RegExp(arg).test(input)
}

function unless (arg, input) {
  return !nawkIf(arg, input)
}

const flags = {
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

const cmdRegex = /^--(append|prepend)/
const condRegex = /^--(unless|if)/

function commandArgs(opts = [], args = []) {
  if (!opts.length || /^--/.test(opts[0])) {
    return [opts, args]
  }

  return [opts.slice(1), args.concat([opts[0]])]
}

function parseArgs (args = [], command = false, commands = [], opts = []) {
  if (!args.length) {
    if (command) {
      commands.push(command)
    }

    return [commands, opts]
  }

  let head = args[0]
  let rest = args.slice(1)

  if (cmdRegex.test(head)) {
    if (command) {
      commands.push(command)
    }
    let [_rest, cmdArg] = commandArgs(rest)
    command = {
      name: head.slice(2),
      args: cmdArg,
      conditions: []
    }
    return parseArgs(_rest, command, commands, opts)
  }

  if (condRegex.test(head)) {
    if (command) {
      command.conditions.push({
        name: head.slice(2),
        args: rest[0]
      })

      return parseArgs(
        rest.slice(1),
        command,
        commands,
        opts
      )
    }
  }

  return parseArgs(rest, command, commands, opts.concat([head]))
}

// reify

function partial (fn, ...initialArgs) {
  return function (...args) {
    return fn(...initialArgs.concat(args))
  }
}

function reifyCommands (args) {
  args.forEach((arg) => {
    if (!flags[arg.name]) { throw new Error(`Unrecognized command ${arg.name}`) }

    arg.fn = partial(
      flags[arg.name].fn,
      arg.args
    )

    arg.conditions.map((condition) => {
      if (!flags[condition.name]) { throw new Error(`Unrecognized condition ${condition.name} for command ${arg.name}`) }
      condition.fn = partial (
        flags[condition.name].fn,
        condition.args
      )

      return condition
    })
  })

  return args
}

// process lines

let delims = {
  'tab': '\t'
}

function process(input, tree) {
  let commands = reifyCommands(tree)
  return commands.reduce((accum, command) => {
    if (command.conditions.every((f) => {
      return f.fn(input)
    })) {
      return command.fn(input)
    } else {
      return input
    }
  }, '')
}

function templateify (expression, context) {
  return expression.replace(/\$\w+/g, (match) => {
    return context[match] ? context[match] : match
  })
}

function lineify (input, expression, delim = 'tab') {
  let columns = input.split(delims[delim])
  let context = columns.reduce((accum, item, index) => {
    accum[`$${index}`] = item
    return accum;
  }, {
    // "special" globals on context
    '$line': columns.join(' ')
  })

  return templateify(expression, context)
}


test('parseArgs', t => {
  let args = ['--append', '","', '--unless', '/bad/']

  let result = parseArgs(args)
  t.deepEqual(result, [
    [
      {
        name: 'append',
        args: ['","'],
        conditions: [
          {
            name: 'unless',
            args: '/bad/'
          }
        ]
      }
    ],
    []
  ])
});

test('reify commands', t => {
  let tree = [
    {
      name: 'append',
      args: [','],
      conditions: [
        {
          name: 'unless',
          args: '/foo/'
        }
      ]
    }
  ]

  let result = reifyCommands(tree)

  t.deepEqual(result[0].fn('foo'), 'foo,')
  t.deepEqual(result[0].conditions[0].fn('foo'), false)
  t.deepEqual(result[0].conditions[0].fn('bar'), true)
})

test('multiple args', t => {
  let args = ['--append', '","', '--unless', '/bad/', '--prepend', '$']

  let result = parseArgs(args)
  t.deepEqual(result, [
    [
      {
        name: 'append',
        args: ['","'],
        conditions: [
          {
            name: 'unless',
            args: '/bad/'
          }
        ]
      },
      {
        name: 'prepend',
        args: ['$'],
        conditions: []
      }
    ],
    []
  ])
});

test('processes input', t => {
  let args = ['--append', ',', '--unless', '/bad/']
  let [tree, opts] = parseArgs(args)

  t.is(process('good hello', tree), 'good hello,')
  t.is(process('bad hello', tree), 'bad hello')
})

test('throws an error for unrecognized commands', t => {
  t.throws(() => {
    reifyCommands([
      {
        name: 'badcommand',
        args: []
      }
    ])
  }, 'Unrecognized command badcommand')
})

test('throws an error for unrecognized conditions', t => {
  t.throws(() => {
    reifyCommands([
      {
        name: 'append',
        args: [],
        conditions: [
          {
            name: 'badcondition',
            args: []
          }
        ]
      }
    ])
  }, 'Unrecognized condition badcondition for command append')
})

test('replacing input with delimiter', t => {
  let input = 'tab0\ttab1\ttab2'
  let expression = '$1!'

  t.is(lineify(input, expression), 'tab1!')
})

test('includes special variables like $line', t => {
  let input = 'tab0\ttab1'
  let expression = 'The whole enchilada: $line and time'

  t.is(lineify(input, expression), 'The whole enchilada: tab0 tab1 and time')
})
