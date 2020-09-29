const { Address } = require("../../../models");

module.exports = {
  createAddress: (req, res) => {
    const { id, deliveryAddress } = req.body;

    return Address.create({
      userID: id,
      deliveryAddress
    })
      .then(address => res.send(address))
      .catch(err => {
        console.error(err);
        res.sendStatus(400);
      });
  }
};
