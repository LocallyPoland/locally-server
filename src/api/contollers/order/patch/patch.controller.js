const {Order} = require("../../../models");

const updateOrder = async (req, res) => {
    try {
        const {id} = req.params;
        const {status} = req.body;
        return await Order.findByIdAndUpdate(id, {status}).exec((err, order) => {
            if (err) {
                console.log(err);
                res.sendStatus(400)
            }
            res.send(order)
        })
    } catch (e) {
        console.log(e);
        res.sendStatus(400)
    }
}

module.exports = {
    updateOrder
}