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
import { Clingy, ILookupSuccess } from "cli-ngy";

const cli = new Clingy({
    hello: {
        fn: () => console.log("Hello World!"), // Command function
        alias: ["helloworld", "hi"], // Array of aliases
        args: [] // Array of argument objects
    },
    lorem: {
        fn: () => null,
        alias: [],
        args: []
    }
});

// Then parse your input:
const result = cli.parse("hello");
console.log(result.successful); // => true
console.log(result.type); // => ResultType.SUCCESS
(<ILookupSuccess>result).command.fn(); // logs "Hello World!"

// Non-existent command.
const error = cli.parse("foo");
console.log(error.successful); // => false
console.log(error.type); // => ResultType.ERROR_NOT_FOUND
```

### Command with arguments

Commands can take any number of required or optional arguments:

```typescript
import { Clingy, ILookupSuccess } from "cli-ngy";

const cli = new Clingy({
    foo: {
        fn: (args) => console.log(args.get("bar")),
        alias: [],
        args: [{
            name: "bar",
            required: true
        }]
    }
});

const result = cli.parse("foo lorem");
(<ILookupSuccess>result).command.fn(); // logs "lorem"

const error = cli.parse("foo");
console.log(error.successful); // => false
console.log(error.type); // => ResultType.ERROR_MISSING_ARGUMENT
```

With optional arguments:

```typescript
import { Clingy, ILookupSuccess } from "cli-ngy";

const cli = new Clingy({
    fizz: {
        fn: (args) => console.log(args.get("fizz") + " : " + args.get("buzz")),
        alias: [],
        args: [{
            name: "fizz",
            required: false,
            defaultValue: "123"
        }, {
          name: "buzz",
          required: false
        }]
    }
});

const result1 = cli.parse("lorem ipsum");
(<ILookupSuccess>result1).command.fn(); // logs "lorem : ipsum"

const result2 = cli.parse("lorem");
(<ILookupSuccess>result1).command.fn(); // logs "lorem : null"

const result3 = cli.parse("");
(<ILookupSuccess>result3).command.fn(); // logs "123 : null"
```

### Nested commands

Commands can be nested with sub-commands:

```typescript
import { Clingy, ILookupSuccess } from "cli-ngy";

const cli = new Clingy({
    fizz: {
        fn: () => console.log(123),
        alias: [],
        args: [],
        sub: {
            bar: {
                fn: () => console.log(456),
                alias: [],
                args: []
            },
            buzz: {
                fn: () => console.log(789),
                alias: [],
                args: []
            }
        }
    }
});

const result1 = cli.parse("fizz");
(<ILookupSuccess>result1).command.fn(); // logs "123"

const result2 = cli.parse("fizz bar");
(<ILookupSuccess>result2).command.fn(); // logs "456"

const result3 = cli.parse("fizz buzz bazz");
(<ILookupSuccess>result3).command.fn(); // logs "789"

```

### Options

The clingy constructor can be used with options:

```typescript
import { Clingy } from "cli-ngy";

const cli = new Clingy({}, {
    caseSensitive: true, // If command names should be case sensitive. Default: true
    legalQuotes: ["\""] // Array of characters to allow for quotes. Default: ["\""]
});
```

