const { User } = require("../../../models");
const jwt = require("jsonwebtoken");
// const { restorePassword } = require("../mailer");

module.exports = {
  getAllUsers: async (req, res) => {
    return await User.find({})
      .then((users) => res.json(users))
      .catch((err) => console.log(err));
  },

  getUser: async (req, res) => {
    const { id } = req.body;
    return await User.findById(id)
      .then((user) => {
        res.json(user);
      })
      .catch((err) => err && res.sendStatus(409));
  },

  cbFb: (req, res) => {
    const { user } = req;
    console.log("FB USER === ", user);

    const token = jwt.sign({ id: user._id },
      process.env.SECRET, {
      expiresIn: "1h",
    });
    console.log("FB TOKEN === ", token);

    res.cookie("token", token, {
      expires: new Date(Date.now() + 90000000),
      secure: true,
      httpOnly: true,
    });

    res.redirect("/api/v1/user");
    // res.send({ token, user });
  },

  cbGoogle: async (req, res) => {
    const { user } = req;
    console.log("GOOGLE USER === ", user);

    const token = jwt.sign({ id: user._id },
      process.env.SECRET, {
      expiresIn: "1h",
    });
    console.log("GOOGLE TOKEN === ", token);

    res.cookie("token", token, {
      expires: new Date(Date.now() + 90000000),
      secure: true,
      httpOnly: true,
    });

    res.redirect("/profile");
    // res.send({ token, user });
  }
};