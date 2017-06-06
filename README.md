# cli-ngy

A module to parse cli-input text and commands.

## Usage

### Simple Command

Init a new instance with a "hello" command:

```js
//new Clingy(commands, options)
const cli = new Clingy({
    hello: {
        fn: () => "Hello World!", //Command function
        alias: ["helloworld", "hi"], //Array of aliases
        args: [] //Array of argument objects
    }
})
```
```js
/*
 * Commands: Must be an object with command props
 * Options:
 */
    {
        /**
         * Options for Lookup (Resolving a command from a string)
         */
        lookup: {
            /**
             * If names should be treated case-sensitive for lookup
             */
            namesAreCaseSensitive: true
        },
        /**
         * Options for Parser (Getting an Array of name/arg strings from a String)
         */
        parser: {
            /**
             * If strings containing spaces should be kept together when enclosed in quotes.
             * true:    'hello world "foo bar"' => ["hello", "world", "foo bar"]
             * false:   'hello world "foo bar"' => ["hello", "world", "\"foo", "bar\""]
             */
            allowQuotedStrings: true,
            /**
             * [Only works with allowQuotedStrings=true]
             * List of characters to support enclosing quotedStrings for
             */
            validQuotes: ["\""],
        }
    }
```

then parse input

```js
cli.parse("hello");

/*
 * Returns:
 */
 {
    success: true,
    command: {
        fn: [Function: fn],
        alias: ["helloworld", "hi"],
        args: [],
        name: "hello"
    },
    path: ["hello",
    pathDangling: []
    args: {
        _all:[]
    }
  } 
```

```js
cli.parse("foo");

/*
 * Returns:
 */
{
    success: false,
    error: {
        type: "missingCommand",
        missing: "foo",
        similar: []
    },
    path: []
}
```

The same result would be achieved by `cli.parse("hi");` as well, as we registered it as alias.

### Command with arguments

You can define which arguments whould be parsed with the command

```js
const cli = new Clingy({
    double:{
        fn: args => args.numberToDouble * 2,
        alias: ["doublenumber"],
        args: [{
            name: "numberToDouble", //name of the property in the args object
            required: true //If this is true, the cli will return an error if no argument is present
        }]
    },
    add:{
        fn: args => args.number1 +  args.number2,
        alias: [],
        args: [{
            name: "number1",
            required: true 
        },{
            name: "number2",
            required: false, //If this is false, the value for `default` will be supplemented
            default: "1"
        }]
    }
})
```
And then

```js
cli.parse("double 10");

/*
 * Returns:
 */
{
    success: true,
    command:
    {
        fn: [Function: fn],
        alias: ["doublenumber"],
        args: [ [Object] ],
        name: "double"
    },
    path: ["double"],
    pathDangling: ["10"],
    args: {
        _all:["10"]
        numberToDouble: "10"
    }
}
```

```js
cli.parse("add 4");

/*
 * Returns:
 */
{
    success: true,
    command:
    {
        fn: [Function: fn],
        alias: [],
        args: [ [Object] ],
        name: "add"
    },
    path: ["add"],
    pathDangling: ["4"],
    args: {
      _all:["4"]
      number1: "4",
      number2: "1"
    }
}
```

### Nested commands

Cli-ngy supports subcommands and command groups:

```js
const cli = new Clingy({
    about: {
        fn: () => "About",
        args: [],
        alias: ["why", "?"],
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

Which can be accessed with

```js
cli.parse("myGroup foo"); //or with aliases: cli.parse("group foo"); or cli.parse("group fizz");

/*
 * Returns:
 */
{
    success: true,
    command: {
        fn: [Function: fn],
        args: [],
        alias: ["fizz"],
        name: "foo"
    },
    path: ["myGroup", "foo"],
    pathDangling: [],
    args: {
        _all:[]
    }
}
```
