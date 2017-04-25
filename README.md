# cli-ngy

A module to manage cli-input-text and commands

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

You can define which arguments whould be parsed with the command

```js
const cli = new Clingy({
    double:{
        fn: args => args.numberToDouble * 2,
        alias: ["doublenumber"],
        args: [{
            name: "numberToDouble", //Name/id of the variable prop
            type: "number", //Type, can be "string", "number", or "boolean"
            required: true //If this is true, the cli will return an error if no argument is present
        }]
    },
    add:{
        fn: args => args.number1 +  args.number2,
        alias: [],
        args: [{
            name: "number1", //Name/id of the variable prop
            type: "number", //Type, can be "string", "number", or "boolean"
            required: true //If this is true, the cli will return an error if no argument is present
        },{
            name: "number2",
            type: "number", 
            required: false,
            default: 1
        }]
    }
})
```
And then

```js
cli.parse("double 10");

/*
 * Returns:
 
{
    success: true,
    command:
    {
        fn: [Function: fn],
        alias: [ 'doublenumber' ],
        args: [ [Object] ],
        name: 'double'
    },
  commandPath: [ 'double' ],
  commandPathRemains: [ '10' ],
  args: {
      numberToDouble: 10
      }
}
*/
```

### Nested instances
