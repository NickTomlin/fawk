fawk
---

awk for people who ~~don't like~~ need the complexity of awk.

Surround each item with double quotes:

```
# myfile.txt
oh
fawk
```

```
cat my_file | nawk '"\1"'
"oh"
"fawk"
```

Surround each item with double quotes and append a comma:

```
cat my_file | nawk '"\1"' --append ','

"oh",
"fawk",
```

Surround each item with double quotes and append a comma, but not on the last line

```
cat my_file | nawk '"\1"' --append ',' unless '\line=last'

"oh",
"fawk"
```

Surround each item with double quotes and append a comma, but not on the last line. BUT also ignore it if it contains the string "foo"

```
cat my_file | nawk '"\1"' ignore '\contains fawk' --append ',' unless '\line=last'
"oh"
```
