const { Address } = require("../../../models");

module.exports = {
  updateAddress: (req, res) => {
    const { id } = req.params;
    const { deliveryAddress } = req.body;

    return Address.findByIdAndUpdate(id, {
      deliveryAddress
    })
      .then(address => res.send(address))
      .catch(err => {
        console.error(err);
        res.sendStatus(400);
      });
  }
};
