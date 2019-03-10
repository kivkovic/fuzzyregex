# fuzzyregex

Does fuzzy matching/replacement in javascript regex, e.g.:

```node
new FuzzyRegExp('ab(c)', 33);
```

creates a regex pattern ```/ab(c)/``` with a fuzzines of 33%, meaning it will match any string matched by ```/ab(c)/```, ```/.?b(c)/```, ```/a.?(c)/``` or ```/ab(.?)/```.

```node
new FuzzyRegExp('ab(c)', 33).match('abe'); 
// returns: [ 'abe', 'e', index: 0, input: 'abe']
```

# API

```node
FuzzyRegExp.constructor(pattern, fuzziness, regExpFlags)
```

```node
FuzzyRegExp.match(string)
```

```node
FuzzyRegExp.replace(string, replacement)
```

```node
FuzzyRegExp.unwrap()
```
