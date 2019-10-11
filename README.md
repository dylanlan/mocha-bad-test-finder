mocha-bad-test-finder
=====================

Do you have some annoying tests?

Want to improve your tests so they're easier to maintain?

If so, this package might be for you!

This is a CLI to help find bad mocha tests that could be improved

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/mocha-bad-test-finder.svg)](https://npmjs.org/package/mocha-bad-test-finder)
[![Downloads/week](https://img.shields.io/npm/dw/mocha-bad-test-finder.svg)](https://npmjs.org/package/mocha-bad-test-finder)
[![License](https://img.shields.io/npm/l/mocha-bad-test-finder.svg)](https://github.com/Dylanlan/mocha-bad-test-finder/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g mocha-bad-test-finder
$ btf COMMAND
running command...
$ btf (-v|--version|version)
mocha-bad-test-finder/0.0.1 win32-x64 node-v10.14.0
$ btf --help [COMMAND]
USAGE
  $ btf COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`btf help [COMMAND]`](#btf-help-command)
* [`btf large [FILE]`](#btf-large-file)

## `btf help [COMMAND]`

display help for btf

```
USAGE
  $ btf help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [src\commands\help.ts](https://github.com/Dylanlan/mocha-bad-test-finder/blob/v0.0.1/src\commands\help.ts)_

## `btf large`

Finds tests that have too many lines of code

```
USAGE
  $ btf large

OPTIONS
  -d, --dir        directory containing tests to search. Defaults to current directory
  -l, --lines      number of lines in tests to find
  -t, --top        find this many large tests
  -h, --help       show CLI help
```

_See code: [src\commands\large.ts](https://github.com/Dylanlan/mocha-bad-test-finder/blob/v0.0.1/src\commands\large.ts)_
<!-- commandsstop -->
