const {Order} = require("../../../models");

const updateOrder = async (res, req) => {
    // try {
        const {id} = req.params;
        const {status} = req.body;
        return await Order.findByIdAndUpdate(id, {status}).exec(err => {
            if (err) {
                console.log(err);
                res.sendStatus(400)
            }
        })
    // } catch (e) {
    //     console.log(e);
    //     res.sendStatus(400)
    // }
}

module.exports = {
    updateOrder
}