fawk
---

awk for people who ~~don't like~~ need the complexity of awk.

```shell
fawk <filename> <expression: '$0'> <options>
input | fawk <expression: '$0'> <options>
```

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
