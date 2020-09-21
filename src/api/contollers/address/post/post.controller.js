const {Address} = require('../../../models');

module.exports = {
    createAddress: (req, res) => {
        const {
            id,
            deliveryCity,
            deliveryStreet,
            deliveryHouse,
            deliveryApartament
        } = req.body;

        return Address.create({
            userID:id,
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
