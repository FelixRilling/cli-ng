# cli-ngy

A module to parse cli-input text and commands with support for nested commands and did-you-mean feature.

## Usage

### Simple Command

Init a new instance with a "hello" command:

```js
// new Clingy(commands, [options])
const cli = new Clingy({
    hello: {
        fn: () => "Hello World!", // Command function
        alias: ["helloworld", "hi"], // Array of aliases
        args: [] // Array of argument objects
    }
});
```

then parse input

```js
cli.parse("hello");

// Returns:
{
    success: true,
    command: {
        fn:  () => "Hello World!",
        alias: ["helloworld", "hi"],
        args: [],
        name: "hello"
    },
    path: ["hello"],
    pathDangling: []
    args: {
        _all:[]
    }
}
```

The same result would be achieved by `cli.parse("hi");` as well, as we registered it as alias.

If we try looking up a non-existent command, we will get an error object:

```js
cli.parse("foo");

// Returns :
{
    success: false,
    error: {
        type: "missingCommand",
        missing: "foo", // name of the missing command, useful for nested commands
        similar: ["hi"] // Suggest similar commands based on string similarity
    },
    path: []
}
```

### Command with arguments

You can define any number of arguments that a command can take

```js
const cli = new Clingy({
    double: {
        fn: args => Number(args.numberToDouble) * 2,
        alias: ["doublenumber"],
        args: [
            {
                name: "numberToDouble", // Name of the property in the args object
                required: true // If this is true, the cli will return an error if no argument is present
            }
        ]
    },
    add: {
        fn: args => Number(args.number1) + Number(args.number2),
        alias: [],
        args: [
            {
                name: "number1",
                required: true
            },
            {
                name: "number2",
                required: false, // If this is false, the value for `default` will be supplemented
                default: Math.PI
            }
        ]
    }
});
```

And then:

```js
cli.parse("double 10");

// Returns:
{
    success: true,
    command:
    {
        fn: args => Number(args.numberToDouble) * 2,
        alias: ["doublenumber"],
        args: [
            {
                name: "numberToDouble",
                required: true
            }
        ]
        name: "double"
    },
    path: ["double"],
    pathDangling: ["10"],
    args: {
        _all:["10"] // Array of all arguments given
        numberToDouble: "10" // Our argument we got
    }
}
```

```js
cli.parse("add 4 5 6");

//  Returns:
{
    success: true,
    command:
    {
        fn: args => Number(args.number1) + Number(args.number2),
        alias: [],
        args: [...]
    },
    path: ["add"],
    pathDangling: ["6"],
    args: {
      _all:["4","5","6"]
      number1: "4",
      number2: "6"
    }
}
```

### Nested commands

Cli-ngy supports subcommands of any depth with the `sub` property:

```js
const cli = new Clingy({
    about: {
        fn: () => "About",
        args: [],
        alias: ["why", "?"]
    },
    myGroup: {
        fn: () => "Group fn",
        args: [],
        alias: ["group"],
        sub: {
            foo: {
                fn: () => "Group subcommand 1",
                args: [],
                alias: ["fizz"]
            },
            bar: {
                fn: () => "Group subcommand 2",
                args: [],
                alias: ["baaa"]
            }
        }
    }
});
```

Which can be accessed with:

```js
cli.parse("myGroup foo"); // Or with aliases: cli.parse("group foo"); or cli.parse("group fizz");

// Returns:
{
    success: true,
    command: {
        fn: () => "Group subcommand 1",
        args: [],
        alias: ["fizz"]
    },
    path: ["myGroup", "foo"],
    pathDangling: [],
    args: {
        _all:[]
    }
}
```

### Options

The constructor can take these options:

```js
{
    /**
     * If names should be treated case-sensitive for lookup.
     */
    caseSensitive: false,
    /**
     * List of characters to allow as quote-enclosing string.
     */
    validQuotes: ["\"", "“", "”"]
}
```
