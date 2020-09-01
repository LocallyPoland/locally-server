const {Address} = require('../../../models');

module.exports = {
    createAddress: (req, res) => {
        const {
            userID,
            deliveryCity,
            deliveryStreet,
            deliveryHouse,
            deliveryApartament
        } = req.body;

        return Address.create({
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
