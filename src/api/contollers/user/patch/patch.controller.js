const {User} = require("../../../models");

module.exports = {
    updateUser: async (req, res) => {
        const {id, fName, lName, phone, email} = req.body;
        return await User.findByIdAndUpdate(
            id, {
                fName,
                lName,
                phone,
                email,
                updatedAt: Date.now()
            },
            (err, user) => {
                if (err) return res.sendStatus(400);
                console.log(user);
                res.send(user);
            }
        );
        // .then((user) => res.json(user))
        // .catch((err) => err && res.sendStatus(409));
    },

    restoreUser: async (req, res) => {
        const {id} = req.params;
        return await User.findByIdAndUpdate(id, {deletedAt: null})
            .then((user) => res.json(user))
            .catch((err) => res.send(err));
    },
}