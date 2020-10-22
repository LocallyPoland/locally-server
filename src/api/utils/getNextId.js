const {Counter} = require("../models");

function getNextSequence(name) {
    console.log(name)
    console.log(Counter)
    const ret = Counter.findAndModify(
        {
            query: {_id: name},
            update: {$inc: {seq: 1}},
            new: true
        }
    );
    return ret.seq;
}

module.exports = {
    getNextSequence
}
