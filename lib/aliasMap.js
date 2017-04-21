"use strict";

module.exports = function (map) {
    const result = new Map(map);

    map.forEach(command=>{
        command.alias.forEach(alias => {
            result.set(alias, command);
        });
    });

    return result;
};
