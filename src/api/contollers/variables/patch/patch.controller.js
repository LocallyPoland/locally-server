const {Variables} = require('../../../models');

const updateSettings = async (req, res) => {
    const {timeStart, timeStop, price, priceForCustomer} = req.body;
    const defaultSettingsId = "5f4781753847c91fad9fd141";
    const settings = await Variables.findByIdAndUpdate(defaultSettingsId, {
        timeStart, timeStop, price, priceForCustomer
    });
    res.send(settings);
}

module.exports = {updateSettings};