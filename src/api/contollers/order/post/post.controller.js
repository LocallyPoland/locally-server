const { Order } = require("../../../models");

const createOrder = (req, res) => {
  const {
    userID,
    products,
    sum,
    status,
    paymentType,
    deliveryAddress
  } = req.body;
  return Order.create({
    userID,
    products,
    sum,
    status,
    deliveryAddress,
    paymentType,
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
