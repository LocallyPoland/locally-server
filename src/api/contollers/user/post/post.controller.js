const {User} = require("../../../models");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
// ====================================================
const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');

const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly', 'https://www.googleapis.com/auth/gmail.send'];
const TOKEN_PATH = 'token.json';
fs.readFile('credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    authorize(JSON.parse(content), listLabels);
});

function authorize(credentials, callback) {
    const {client_secret, client_id, redirect_uris} = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);

    fs.readFile(TOKEN_PATH, (err, token) => {
        if (err) return getNewToken(oAuth2Client, callback);
        oAuth2Client.setCredentials(JSON.parse(token));
        callback(oAuth2Client);
    });
}

function getNewToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
            if (err) return console.error('Error retrieving access token', err);
            oAuth2Client.setCredentials(token);
            fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                if (err) return console.error(err);
                console.log('Token stored to', TOKEN_PATH);
            });
            callback(oAuth2Client);
        });
    });
}

function listLabels(auth) {
    const gmail = google.gmail({version: 'v1', auth});
    gmail.users.labels.list({
        userId: 'me',
    }, (err, res) => {
        if (err) return console.log('The API returned an error: ' + err);
        const labels = res.data.labels;
        if (labels.length) {
            console.log('Labels:');
            labels.forEach((label) => {
                console.log(`- ${label.name}`);
            });
        } else {
            console.log('No labels found.');
        }
    });
}

function makeBody(to, from, subject, message) {
    var str = ["Content-Type: text/html; charset=\"UTF-8\"\n",
        "MIME-Version: 1.0\n",
        "Content-Transfer-Encoding: 7bit\n",
        "to: ", to, "\n",
        "from: ", from, "\n",
        "subject: ", subject, "\n\n",
        message
    ].join('');

    var encodedMail = new Buffer(str).toString("base64").replace(/\+/g, '-').replace(/\//g, '_');
    return encodedMail;
}

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
                        res.json({isAdmin: user.role, email: user.email});
                    } else {
                        const token = jwt.sign({user: user}, process.env.SECRET);
                        res.send({user, token});
                    }
                } else {
                    res.sendStatus(409)
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

                        function sendMessage(auth) {
                            const gmail = google.gmail({version: 'v1', auth});
                            const raw = makeBody(email, 'locallypoland@gmail.com', 'Verify Email', `<a href="https://locally-pl.herokuapp.com/api/v1/verifyEmail?email=${email}"> click for verify</a>`);
                            gmail.users.messages.send({
                                auth: auth,
                                userId: 'me',
                                resource: {
                                    raw: raw
                                }
                            }, function (err, response) {
                                console.log(err || response)
                            });
                        }

                        fs.readFile('credentials.json', (err, content) => {
                            if (err) return console.log('Error loading client secret file:', err);
                            authorize(JSON.parse(content), sendMessage);
                        });
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
                        function sendMessage(auth) {
                            const gmail = google.gmail({version: 'v1', auth});
                            const raw = makeBody(email, 'locallypoland@gmail.com', 'Verify Email', `${randomizerPass}`);
                            gmail.users.messages.send({
                                auth: auth,
                                userId: 'me',
                                resource: {
                                    raw: raw
                                }
                            }, function (err, response) {
                                console.log(err || response)
                            });
                        }

                        fs.readFile('credentials.json', (err, content) => {
                            if (err) return console.log('Error loading client secret file:', err);
                            authorize(JSON.parse(content), sendMessage);
                        });

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
    facebook: async (req, res) => {
        const {
            id,
            fName,
            lName
        } = req.body;
        await User.findOne({facebookID: id})
            .then(user => {
                    if (!user) {
                        User.create({
                            facebookID: id,
                            fName,
                            lName,
                            isVerified: true
                        }).then(user => {
                            const token = jwt.sign({user: user}, process.env.SECRET, {
                                expiresIn: "1h",
                            });
                            res.send({token,user})
                        }).catch(err => {
                            console.log(err)
                            res.sendStatus(400)
                        })
                    }
                    const token = jwt.sign({user: user}, process.env.SECRET, {
                        expiresIn: "1h",
                    });
                    res.send({token,user})
                }
            ).catch(err => {
                console.log(err)
                res.sendStatus(400)
            })
    }
}
