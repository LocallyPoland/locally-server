require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const path = require("path");
const db = require("./src/db");
const passport = require("passport");
const passportFBconfig = require('./src/api/passport/facebook.strategy');
const {
    User,
    Order,
} = require("./src/api/routes");
const { timeChecker } = require("./src/api/utils/timeCheck");

// parse application/x-www-form-urlencoded & application/json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());

db();

app.disable("x-powered-by");

// access cors (temporary)
app.use(cors());

app.use(
    "/api/v1", timeChecker,
    User,
    Order,
);

app.use(passport.initialize());
app.use(passport.session());

// use static
app.use(express.static(path.resolve(__dirname, "./build")));

app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "./build/index.html"));
});

// handle 404 (user errors)
app.use((req, res, next) => {
    res.status(404).send(`<h2>Oops 404</h2> <h3>We think you are lost!</h3>`);
});

app.listen(process.env.PORT, () => {
    console.log(`Server starting on port ${process.env.PORT}`);
});