const {User} = require("../../../models");
const jwt = require("jsonwebtoken");

module.exports = {
    getAllUsers: async (req, res) => {
        const length = await User.countDocuments();

        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1;

        const yearForSearch = new Date(`${year}-01-01`);
        const monthForSearch = new Date(`${year}-0${month}-01`);
        const quarterForSearch = new Date(`${year}-0${month - 3}-01`);

        const usersPerYear = await User.find({createdAt: {$gte: yearForSearch}});
        const usersPerMonth = await User.find({createdAt: {$gte: monthForSearch}});
        const usersPerQuarter = await User.find({createdAt: {$gte: quarterForSearch}});

        res.send({
            usersPerYear: usersPerYear.length,
            usersPerMonth: usersPerMonth.length,
            usersPerQuarter: usersPerQuarter.length,
            allUsers: length
        })
    },

    getUser: async (req, res) => {
        const {id} = req.body;
        return await User.findById(id)
            .then((user) => {
                res.json(user);
            })
            .catch((err) => {
                console.error(err);
                res.sendStatus(409)
            });
    },

    cbFb: (req, res) => {
        const {user} = req;
        console.log("FB USER === ", user);

        const token = jwt.sign({id: user._id},
            process.env.SECRET);
        console.log("FB TOKEN === ", token);

        res.cookie("token", token, {
            expires: new Date(Date.now() + 90000000),
            secure: true,
            httpOnly: true,
        });

        res.redirect("/api/v1/user");
        // res.send({ token, user });
    },
    verifyEmail: async (req, res) => {
        try {
            const {email} = req.query;
            const updated = await User.findOneAndUpdate({email: email}, {isVerified: true}, {new: true})
            res.send('Email Verified').status(200);
        } catch (e) {
            console.log(e)
            res.sendStatus(400);
        }
    }
};
