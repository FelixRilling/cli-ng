# cli-ngy

A module to parse cli-input

## Install

npm:

```shell
npm install cli-ngy --save
```
yarn:

```shell
yarn add cli-ngy --save
```

## Usage

### Simple Command

Init a new instance with a "hello" command:

```js
const cli = new Clingy({
    hello: {
        fn: () => "Hello World!", //Command function
        alias: ["helloworld", "hi"], //Array of aliases
        args: [] //Array of argument objects
    }
})
```

then parse input

```js
cli.parse("hello");

/*
 * Returns:
 
 {
    success: true,
    command: {
        fn: [Function: fn],
        alias: [ 'helloworld', 'hi'],
        args: [],
        name: 'hello'
    },
    caller: 'hello',
    args: {}
  } 
*/
```

The same result would be achieved by `cli.parse("hi");` as well, as we registered that as alias.

### Command with arguments

If we expand the first example with a command that uses arguments, it could look like this:

```js
const cli = new Clingy({
    hello:{
        fn:()=>"Hello World!",
        alias: ["helloworld", "hi"],
        args: []
    },
    double:{
        fn: args => args.numberToDouble * 2,
        alias: ["doublenumber"],
        args: [{
            name: "numberToDouble", //Name/id of the variable prop
            type: "number", //Type, can be "string", "number", or "boolean"
            required: true //If this is true, the cli will return an error if no argument is present
        }]
    }
})
```
