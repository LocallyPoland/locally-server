const {Variables} = require('../../../models');

const getSettings = async (req, res) => {
    const defaultSettingsId = "5f4781753847c91fad9fd141";
    const settings = await Variables.findById(defaultSettingsId);
    res.send(settings);
}

module.exports = {getSettings}