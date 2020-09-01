const {Address} = require('../../../models');

module.exports = {
    updateAddress: (req, res) => {
        const {id} = req.params;
        const {
            userID,
            deliveryCity,
            deliveryStreet,
            deliveryHouse,
            deliveryApartament
        } = req.body;

        return Address.findByIdAndUpdate(id, {
            userID,
            deliveryCity,
            deliveryStreet,
            deliveryHouse,
            deliveryApartament
        }).then(address => res.send(address))
            .catch(err => {
                console.error(err);
                res.sendStatus(400)
            })
    }
}
