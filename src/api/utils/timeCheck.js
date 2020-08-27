const { Variables } = require('../models/index');

const timeChecker = (req, res, next) => {
  return Variables.find().then(variables => {
    if (variables.timeStart === Date.now().getHours() && variables.timeStop === Date.now().getHours()) {
      res.send({ error: true })
    } else {
      next();
    }
  })
}

module.exports = {
  timeChecker
};