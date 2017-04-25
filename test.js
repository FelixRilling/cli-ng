"use strict";

const Clingy = require("./index.js");

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

const result = cli.parse("double 10");

console.log(result);
