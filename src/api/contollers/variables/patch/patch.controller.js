const {Variables} = require('../../../models');

const updateSettings = async (req, res) => {
    const {timeStart, timeStop, price, priceForCustomer, switcher} = req.body;
    const settings = await Variables.findByIdAndUpdate(process.env.DEFAULT_SETTINGS_ID, {
        timeStart, timeStop, price, priceForCustomer, switcher
    });
    res.send(settings);
}

module.exports = {updateSettings};