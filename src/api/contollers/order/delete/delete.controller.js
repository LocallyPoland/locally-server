const { Order } = require("../../../models");

const deleteOrder = async (req, res) => {
  const { id } = req.params;
  return await Order.findByIdAndRemove(id).exec((err, order) => {
    if (err) return res.send(err);
    res.status(200).send("Deleted");
  });
};

module.exports = { deleteOrder };
