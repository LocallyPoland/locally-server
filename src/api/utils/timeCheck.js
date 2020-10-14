const {Variables} = require('../models');

const timeChecker = (req, res, next) => {
    return Variables.findById("5f4781753847c91fad9fd141")
        .then(variable => {
            const time = new Date;
            // if (variable.timeStart === time.getHours() && variable.timeStop === time.getHours() && !variable.switcher) {
                if (variable.timeStart <= time.getHours() && variable.timeStop >= time.getHours() && !variable.switcher) {
                res.send({error: true})
            } else {
                next();
            }
        }).catch(err => console.error(err))
}

module.exports = {
    timeChecker
};
