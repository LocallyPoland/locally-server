const { Order } = require("../../../models");

const createOrder = async (req, res) => {
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
    deliveryWarehouse,
  } = req.body;
  await Order.create({
    userID,
    products,
    sum,
    status,
    deliveryCity,
    deliveryStreet,
    deliveryHouse,
    deliveryApartament,
    deliveryWarehouse,
    paymentType,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    deletedAt: null,
  })
    .then((order) => console.log(order))
    .catch((err) => err && res.sendStatus(400));
  await User.findByIdAndUpdate(userID, {
    deliveryCity,
    deliveryStreet,
    deliveryHouse,
    deliveryApartament,
    deliveryWarehouse,
  }).exec((err) => {
    if (err) {
      console.log(err);
      res.sendStatus(400);
    }
    res.sendStatus(200);
  });
  await products.forEach((prod) => {
    Product.findByIdAndUpdate(prod.id, {
      $inc: { quantity: -prod.quantity },
    }).exec((err) => {
      if (err) {
        console.log(err);
        res.sendStatus(400);
      }
    });
  });
};

module.exports = {
  createOrder
}