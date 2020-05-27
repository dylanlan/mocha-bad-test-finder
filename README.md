mocha-bad-test-finder (btf)
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
mocha-bad-test-finder/0.0.3 win32-x64 node-v10.17.0
$ btf --help [COMMAND]
USAGE
  $ btf COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`btf flaky`](#btf-flaky)
* [`btf help [COMMAND]`](#btf-help-command)
* [`btf interactive`](#btf-interactive)
* [`btf large`](#btf-large)
* [`btf slow`](#btf-slow)

## `btf flaky`

Find tests that sometimes fail

```
USAGE
  $ btf flaky

OPTIONS
  -d, --dir=dir    the directory containing tests to search
  -h, --help       show CLI help
  -r, --runs=runs  number of test runs to execute

EXAMPLE
  $ btf flaky --dir=/some/test/dir --runs=10
  # outputs any tests which failed from 10 runs
```

_See code: [src\commands\flaky.ts](https://github.com/Dylanlan/mocha-bad-test-finder/blob/v0.0.3/src\commands\flaky.ts)_

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

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.2.3/src\commands\help.ts)_

## `btf interactive`

Find tests that interact with each other (not implemented yet)

```
USAGE
  $ btf interactive

OPTIONS
  -d, --dir=dir  the directory containing tests to search
  -h, --help     show CLI help

EXAMPLE
  $ btf interactive --dir=/some/test/dir
  # outputs tests from the given directory which failed either when run individually or all together
```

_See code: [src\commands\interactive.ts](https://github.com/Dylanlan/mocha-bad-test-finder/blob/v0.0.3/src\commands\interactive.ts)_

## `btf large`

Find tests that have too many lines of code

```
USAGE
  $ btf large

OPTIONS
  -d, --dir=dir      the directory containing tests to search
  -h, --help         show CLI help
  -l, --lines=lines  number of lines of test code that is too many
  -t, --top=top      number of tests to find

EXAMPLE
  $ btf large --dir=/some/test/dir --lines=50 --top=20
  # outputs the 20 largest tests from the given directory that have at least 50 lines
```

_See code: [src\commands\large.ts](https://github.com/Dylanlan/mocha-bad-test-finder/blob/v0.0.3/src\commands\large.ts)_

## `btf slow`

Find tests that take a long time to execute (not implemented yet)

```
USAGE
  $ btf slow

OPTIONS
  -d, --dir=dir                    the directory containing tests to search
  -h, --help                       show CLI help
  -m, --milliSeconds=milliSeconds  number of milliseconds to execute that is too many
  -t, --top=top                    number of tests to find

EXAMPLE
  $ btf slow --dir=/some/test/dir --milliSeconds=500 --top=20
  # outputs the 20 slowest tests from the given directory that take at least 500 milliseconds
```

_See code: [src\commands\slow.ts](https://github.com/Dylanlan/mocha-bad-test-finder/blob/v0.0.3/src\commands\slow.ts)_
<!-- commandsstop -->
