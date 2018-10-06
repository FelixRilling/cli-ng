# cli-ngy

> TypeScript command line parsing library for bots

## Introduction

TypeScript counterpart of [cli-ngy4j](https://github.com/FelixRilling/cli-ngy4j).

**[Docs](https://felixrilling.github.io/cli-ngy/)**

## Usage

```shell
npm install cli-ngy
```

### Simple Command

Init a new instance with a "hello" command:

```typescript
import {Clingy} from "cli-ngy";

// new Clingy(commands, [options])
const cli = new Clingy({
    hello: {
        fn: () => console.log("Hello World!"), // Command function
        alias: ["helloworld", "hi"], // Array of aliases
        args: [] // Array of argument objects
    }
});

// Then parse your input:
const result = cli.parse("hello");

result.command.fn(); // logs "Hello World!"
```

The same result would be achieved by `cli.parse("hi");` as well, as we registered it as alias.

If we try looking up a non-existent command, we will get an error object:

```typescript
const error = cli.parse("foo");

// Returns :
console.log(error.success); // => false
console.log(error.type) // => ResultType.ERROR_NOT_FOUND
```

### Command with arguments

***TODO*** 

### Nested commands

***TODO*** 

### Options

***TODO*** 

