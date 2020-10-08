const {Order} = require("../../../models");

const createOrder = (req, res) => {
    const {
        user,
        parcel,
        sum,
        weight,
        length,
        status,
        pickUp,
        paymentType,
        deliveryAddress,
        deliveryTime
    } = req.body;

    return Order.create({
        userID: user._id,
        parcel,
        sum,
        weight,
        length,
        status,
        pickUp,
        paymentType,
        deliveryAddress,
        deliveryTime,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        deletedAt: null
    })
        .then(order => res.send(order))
        .catch(err => err && res.sendStatus(400));
};

module.exports = {
    createOrder
};
