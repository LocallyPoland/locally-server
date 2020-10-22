const {Counter} = require("../models");

async function getNextSequence(name) {
    const result = await Counter.findByIdAndUpdate(
        {_id: name},
        {$inc: {seq: 1}},
        {new: true}
    )
    return result.seq
}

module.exports = {
    getNextSequence
}
