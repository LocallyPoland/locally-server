const {Address} = require('../../../models');

module.exports = {

    deleteAddress: (req, res) => {
        const {id} = req.params;
        return Address.findByIdAndDelete(id)
            .then((address) => res.json(address))
            .catch((err) => console.log(err));
    },
}
