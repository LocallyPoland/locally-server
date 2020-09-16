const {Variables} = require('../../../models');

const getSettings = async (req, res) => {
    const settings = await Variables.findById(process.env.DEFAULT_SETTINGS_ID, {_id: 0});
    res.send(settings);
}

module.exports = {getSettings}