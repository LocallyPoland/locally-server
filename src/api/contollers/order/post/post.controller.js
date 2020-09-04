const { Order } = require("../../../models");

const createOrder = (req, res) => {
  const {
    userID,
    products,
    sum,
    status,
    paymentType,
    deliveryCity,
    deliveryStreet,
    deliveryHouse,
    deliveryApartament,
  } = req.body;
  return  Order.create({
    userID,
    products,
    sum,
    status,
    deliveryCity,
    deliveryStreet,
    deliveryHouse,
    deliveryApartament,
    paymentType,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    deletedAt: null,
  })
    .then((order) => console.log(order))
    .catch((err) => err && res.sendStatus(400));
};

module.exports = {
  createOrder
}