mntd-pass
=========

A secret manager for your CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/mntd-pass.svg)](https://npmjs.org/package/mntd-pass)
[![Downloads/week](https://img.shields.io/npm/dw/mntd-pass.svg)](https://npmjs.org/package/mntd-pass)
[![License](https://img.shields.io/npm/l/mntd-pass.svg)](https://github.com/julianduque/mntd-pass/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g mntd-pass
$ mntd-pass COMMAND
running command...
$ mntd-pass (-v|--version|version)
mntd-pass/1.0.0 linux-x64 node-v12.16.1
$ mntd-pass --help [COMMAND]
USAGE
  $ mntd-pass COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`mntd-pass help [COMMAND]`](#mntd-pass-help-command)
* [`mntd-pass secrets`](#mntd-pass-secrets)
* [`mntd-pass secrets:create USERNAME NAME`](#mntd-pass-secretscreate-username-name)
* [`mntd-pass secrets:delete USERNAME NAME`](#mntd-pass-secretsdelete-username-name)
* [`mntd-pass secrets:get USERNAME NAME`](#mntd-pass-secretsget-username-name)
* [`mntd-pass secrets:list USERNAME`](#mntd-pass-secretslist-username)
* [`mntd-pass secrets:update USERNAME NAME`](#mntd-pass-secretsupdate-username-name)
* [`mntd-pass users`](#mntd-pass-users)
* [`mntd-pass users:create USERNAME`](#mntd-pass-userscreate-username)
* [`mntd-pass users:list`](#mntd-pass-userslist)

## `mntd-pass help [COMMAND]`

display help for mntd-pass

```
USAGE
  $ mntd-pass help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.2.3/src/commands/help.ts)_

## `mntd-pass secrets`

Manage secrets by user

```
USAGE
  $ mntd-pass secrets
```

_See code: [src/commands/secrets/index.js](https://github.com/julianduque/mntd-pass/blob/v1.0.0/src/commands/secrets/index.js)_

## `mntd-pass secrets:create USERNAME NAME`

Creates a secret by name

```
USAGE
  $ mntd-pass secrets:create USERNAME NAME
```

_See code: [src/commands/secrets/create.js](https://github.com/julianduque/mntd-pass/blob/v1.0.0/src/commands/secrets/create.js)_

## `mntd-pass secrets:delete USERNAME NAME`

Delete a secret by username and name

```
USAGE
  $ mntd-pass secrets:delete USERNAME NAME
```

_See code: [src/commands/secrets/delete.js](https://github.com/julianduque/mntd-pass/blob/v1.0.0/src/commands/secrets/delete.js)_

## `mntd-pass secrets:get USERNAME NAME`

Lists secrets by username

```
USAGE
  $ mntd-pass secrets:get USERNAME NAME

OPTIONS
  -c, --copy
```

_See code: [src/commands/secrets/get.js](https://github.com/julianduque/mntd-pass/blob/v1.0.0/src/commands/secrets/get.js)_

## `mntd-pass secrets:list USERNAME`

Lists secrets by username

```
USAGE
  $ mntd-pass secrets:list USERNAME
```

_See code: [src/commands/secrets/list.js](https://github.com/julianduque/mntd-pass/blob/v1.0.0/src/commands/secrets/list.js)_

## `mntd-pass secrets:update USERNAME NAME`

Update a secret by username and name

```
USAGE
  $ mntd-pass secrets:update USERNAME NAME
```

_See code: [src/commands/secrets/update.js](https://github.com/julianduque/mntd-pass/blob/v1.0.0/src/commands/secrets/update.js)_

## `mntd-pass users`

Manage users

```
USAGE
  $ mntd-pass users
```

_See code: [src/commands/users/index.js](https://github.com/julianduque/mntd-pass/blob/v1.0.0/src/commands/users/index.js)_

## `mntd-pass users:create USERNAME`

Creates an user

```
USAGE
  $ mntd-pass users:create USERNAME
```

_See code: [src/commands/users/create.js](https://github.com/julianduque/mntd-pass/blob/v1.0.0/src/commands/users/create.js)_

## `mntd-pass users:list`

List all users

```
USAGE
  $ mntd-pass users:list
```

_See code: [src/commands/users/list.js](https://github.com/julianduque/mntd-pass/blob/v1.0.0/src/commands/users/list.js)_
<!-- commandsstop -->
