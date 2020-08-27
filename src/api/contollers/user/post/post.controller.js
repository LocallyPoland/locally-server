const { User } = require("../../../models");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

module.exports = {
  login: (req, res) => {
    const { email, password } = req.body;
    const key = crypto.createHash("md5").update(password).digest("hex");
    return User.findOne({ email: email, password: key })
      .then((user) => {
        if (user.email === email) {
          if (user.password === key) {
            if (user.role === true) {
              const token = jwt.sign({ user: user },
                process.env.SECRET_ADMIN, {
                expiresIn: "1h",
              }
              );
              res.cookie("token", token, {
                expires: new Date(Date.now() + 90000000),
                httpOnly: true,
                secure: true,
              });
              //TODO user id send with cookie
              res.json({ isAdmin: user.role, token });
            } else {
              const token = jwt.sign({ user: user }, process.env.SECRET, {
                expiresIn: "1h",
              });
              res.cookie("token", token, {
                expires: new Date(Date.now() + 90000000),
                secure: true,
                httpOnly: true,
              });
              res.send({ user, token });
            }
          } else {
            console.log("err 1 ");
            res.sendStatus(403);
          }
        } else {
          console.log("err 2 ");
          res.sendStatus(403);
        }
      })
      .catch((err) => {
        console.log("Err === ", err);
        res.sendStatus(403);
      });
  },

  register: async (req, res) => {
    const { fName, lName, fatherName, phone, email, password } = req.body;
    const key = crypto.createHash("md5").update(password).digest("hex");
    return await User.findOne({ email: email }).then((user) => {
      if (!user) {
        User.create({
          fName,
          lName,
          fatherName,
          phone,
          email,
          password: key,
          role: false,
        })
          .then((user) => {
            const token = jwt.sign({ id: user._id }, process.env.SECRET, {
              expiresIn: "1h",
            });
            res.send({ token, user });
          })
          .catch((err) => {
            console.log(err);
            res.sendStatus(400)
          });
      } else {
        res.sendStatus(409);
      }
    });
  },

  changePassword: async (req, res) => {
    const { email, password } = req.body;
    const key = crypto.createHash("md5").update(password).digest("hex");
    return await User.findOne({ email: email }, { password: key })
      .then((user) => {
        // jwt.verify()
        res.send("pass changed successfully");
      })
      .catch((err) => res.send(err));
  },

  restorePassword: async (req, res) => {
    const { email } = req.body;
    return await User.findOne({ email: email })
      .then((user) => {
        if (user) {
          // restorePassword(email);
          // jwt.sign()
          res.sendStatus(200);
        } else {
          res.sendStatus(400);
        }
      })
      .catch((err) => err && res.sendStatus(409));
  },
}