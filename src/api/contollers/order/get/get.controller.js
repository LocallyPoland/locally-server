const { Order } = require("../../../models");

const getAllOrders = async (req, res) => {
  return await Order.find()
    .populate({
      path: "userID",
      select: "fName lName -_id",
    })
    .exec((err, news) => {
      if (err) return res.send(err);
      res.send(news);
    });
};

const getOrder = async (req, res) => {
  const { id } = req.body;
  return await Order.findById(id).exec((err, order) => {
    if (err) return res.send(err);
    res.send(order);
  });
};

const userOrderHistory = (req, res) => {
  const { id } = req.body;
  const { from, to } = req.query;
  
  Order.find({ userID: id })
    .exec((err, orders) => {
      if (err) {
        res.sendStatus(400)
      }
      res.send(orders)
    })
}

module.exports = { getAllOrders, getOrder, userOrderHistory };