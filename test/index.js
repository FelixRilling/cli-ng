const Clingy = require("../dist/clingy.common");

const cli = new Clingy({
    double: {
        fn: args => Number(args.numberToDouble) * 2,
        alias: ["doublenumber"],
        args: [
            {
                name: "numberToDouble", //name of the property in the args object
                required: true //If this is true, the cli will return an error if no argument is present
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
                required: false, //If this is false, the value for `default` will be supplemented
                default: Math.PI
            }
        ]
    }
});

console.log(cli.parse("add 4 5 6"));
