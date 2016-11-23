fawk [![npm version](https://badge.fury.io/js/fawk.svg)](https://badge.fury.io/js/fawk) [![ci](https://travis-ci.org/NickTomlin/fawk.svg?branch=master)](https://travis-ci.org/NickTomlin/fawk)
---

Not awk: awk for people who want to hack a bunch of text and don't want the power or complexity of awk. This is an attempt to cover some simple use cases of awk without creating a full blown programming language.

Installation:

```shell
npm i -g fawk
```

Usage

```
fawk <filename> <expression: '$0'> <options>
input | fawk <expression: '$0'> <options>
```

Examples
---

Surround each item with double quotes:

```
# myfile.txt
oh
fawk
```

```
cat my_file | fawk '"$1"'
"oh"
"fawk"
```

Surround each item with double quotes and append a comma:

```
cat my_file | fawk '"$1"' --append ','

"oh",
"fawk",
```

Surround each item with double quotes and append a comma, but not on lines that contain the phrase 'oh'

```
cat my_file | fawk '"\1"' --append ',' --unless '/oh/'

"oh"
"fawk",
```

Contributing
---

After cloning this repo:

```
# Unit and linting
npm t


# Unit tests
npm run test:unit

# Linting
npm run lint

# Integration tests
# ensure that python and cram are installed (pip install cram)
npm run test:integration
```

Integration tests use [cram](https://bitheap.org/cram/)
