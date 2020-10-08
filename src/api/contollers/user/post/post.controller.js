const {User} = require("../../../models");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require('gmail-send')({
    user: 'locallypoland@gmail.com',
    pass: 'locallyPoland2020',
});
const nodeMailer = require('nodemailer');
const SMTPTransporter = nodeMailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'locallypoland@gmail.com',
        pass: 'locallyPoland2020',
    }
})
const gmailSender = nodeMailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
})
const sendGridSender = nodeMailer.createTransport({
    host: "smtp.sendgrid.net",
    port: 465,
    secure: true,
    auth: {
        user: process.env.SENDGRID_USER,
        pass: process.env.SENDGRID_API_KEY_GMAIL
    }
})

module.exports = {

    login: (req, res) => {
        const {email, password} = req.body;
        const key = crypto.createHash("md5").update(password).digest("hex");
        return User.findOne({email: email, password: key})
            .then((user) => {
                if (user) {
                    if (user.role === true) {
                        const token = jwt.sign({user: user}, process.env.SECRET_ADMIN);

                        res.cookie("aToken", token, {
                            httpOnly: true,
                            secure: true,
                        });
                        res.json({isAdmin: user.role});
                    } else {
                        const token = jwt.sign({user: user}, process.env.SECRET);
                        res.send({user, token});
                    }
                } else {
                    res.send('No such User').status(409)
                }
            })
            .catch((err) => {
                console.log("Err === ", err);
                res.sendStatus(403);
            });
    },

    register: (req, res) => {
        const {fName, lName, phone, email, password} = req.body;
        const key = crypto.createHash("md5").update(password).digest("hex");
        return User.findOne({email: email}).then((user) => {
            if (!user) {
                User.create({
                    fName,
                    lName,
                    phone,
                    email,
                    isVerified: false,
                    password: key,
                    role: false,
                })
                    .then(async (user) => {
                        const token = jwt.sign({user: user}, process.env.SECRET, {
                            expiresIn: "1h",
                        });

                        // SMTPTransporter.sendMail({
                        //     from: 'locallypoland@gmail.com',
                        //     to: email,
                        //     subject: 'test',
                        //     html: `<a href="https://locally-pl.herokuapp.com/api/v1/verifyEmail?email=${email}"> click for verify</a>`
                        // }, function (err, info) {
                        //     if (err) {
                        //         console.error(err)
                        //     } else {
                        //         console.log(info)
                        //     }
                        // })
                        // gmailSender.sendMail({
                        //         from: 'locallypoland@gmail.com',
                        //         to: email,
                        //         subject: 'Verify Your Email',
                        //         html: `<a href="https://locally-pl.herokuapp.com/api/v1/verifyEmail?email=${email}"> click for verify</a>`
                        //     }, function (err, info) {
                        //         if (err) {
                        //             console.error(err)
                        //         } else {
                        //             console.log(info)
                        //         }
                        //     }
                        // )
                        sendGridSender.sendMail({
                                from: 'locallypoland@gmail.com',
                                to: email,
                                subject: 'Verify Your Email',
                                html: `<a href="https://locally-pl.herokuapp.com/api/v1/verifyEmail?email=${email}"> click for verify</a>`
                            }, function (err, info) {
                                if (err) {
                                    console.error(err)
                                } else {
                                    console.log(info)
                                }
                            }
                        )
                        res.send({token, user});
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
        const {email, code, password} = req.body;
        const key = crypto.createHash("md5").update(password).digest("hex");
        return await User.findOneAndUpdate(
            {$and: [{email: email}, {password: code}]},
            {password: key},
            {new: true}
        )
            .then((user) => {
                if (user) {
                    res.status(200).send("pass changed successfully");
                } else {
                    res.sendStatus(400)
                }
            })
            .catch((err) => res.send(err));
    },

    restorePassword: async (req, res) => {
        const {email} = req.body;
        const date = new Date();
        const randomizerPass = `${date.getMilliseconds()}${date.getSeconds()}`

        return await User.findOneAndUpdate({email: email}, {password: randomizerPass})
            .then(async (user) => {
                if (user) {
                    try {
                        const {result, full} = await sendEmail({
                            user: 'locallypoland@gmail.com',
                            pass: 'locallyPoland2020',
                            to: email,
                            subject: 'Verify Your Email',
                            text: randomizerPass
                        });
                        // console.log(result, full)
                    } catch (error) {
                        console.error('ERROR', error);
                    }
                    res.sendStatus(200);
                } else {
                    res.sendStatus(400);
                }
            })
            .catch((err) => {
                console.log(err)
                res.sendStatus(409)
            });
    },
}
