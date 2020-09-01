const {Address} = require('../../../models');

module.exports = {
    getAllAddress: (req, res) => {
        return Address.find({})
            .then((address) => res.json(address))
            .catch((err) => console.log(err));
    },

    getAddress: (req, res) => {
        const {id} = req.params;
        return Address.findById(id)
            .then((address) => res.json(address))
            .catch((err) => console.log(err));
    },
}
