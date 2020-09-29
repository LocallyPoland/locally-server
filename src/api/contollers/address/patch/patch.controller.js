const { Address } = require("../../../models");

module.exports = {
  updateAddress: (req, res) => {
    const { id } = req.params;
    const { userID, deliveryAddress } = req.body;

    return Address.findByIdAndUpdate(id, {
      userID,
      deliveryAddress
    })
      .then(address => res.send(address))
      .catch(err => {
        console.error(err);
        res.sendStatus(400);
      });
  }
};
