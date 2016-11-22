Displays usage and example if invoked without arguments:

  $ $NAWK_PATH/bin/nawk
  nawk <expression> <commands> <options>
  nawk file.txt '$1' --append ,
  [1]

Works when input is piped (TODO: figure out how to force not piping)

  $ cat $NAWK_PATH/test/fixtures/spaced-simple.txt | $NAWK_PATH/bin/nawk '$3' --append ,
  00:01:18,
  00:01:19,

Works with multiple conditions

  $ cat $NAWK_PATH/test/fixtures/spaced-simple.txt | $NAWK_PATH/bin/nawk '$3' --append , --if '18'
  00:01:18,
  00:01:19
