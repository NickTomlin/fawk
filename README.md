nawk
---

Not awk: awk for people who want to hack a bunch of text and don't want the power or complexity of awk.

```shell
nawk <filename> <expression: '$0'> <options>
input | nawk <expression: '$0'> <options>
```

Surround each item with double quotes:

```
# myfile.txt
oh
nawk
```

```
cat my_file | nawk '"$1"'
"oh"
"nawk"
```

Surround each item with double quotes and append a comma:

```
cat my_file | nawk '"$1"' --append ','

"oh",
"nawk",
```

Surround each item with double quotes and append a comma, but not on lines that contain the phrase 'oh'

```
cat my_file | nawk '"\1"' --append ',' --unless '/oh/'

"oh"
"nawk",
```
