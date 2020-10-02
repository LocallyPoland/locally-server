const jwt = require("jsonwebtoken");

const verifyAdminToken = (req, res, next) => {
    // const authHeader = req.headers.authorization;
    // const token = authHeader && authHeader.split(" ")[1];
    const cookieAtoken = req.cookies.aToken;
    console.log("Cookie Atoken === ", cookieAtoken);

    if (!cookieAtoken) {
        return res.sendStatus(401);
    }

    jwt.verify(cookieAtoken, process.env.SECRET_ADMIN, (err, decoded) => {
        console.error("DECODED === ", decoded);
        if (err) {
            console.error("ERROR WITH TOKEN === ", err);
            return res.sendStatus(403)
        };
        req.body.id = decoded.user._id;
        next();
    });
    //  ============================= REQ.HEADER TOKEN =========================================== 
    // if (!token) {
    //     return res.sendStatus(401);
    // }
    //
    // jwt.verify(token, process.env.SECRET_ADMIN, (err, decoded) => {
    //     console.error("DECODED === ", decoded);
    //     if (err) {
    //         console.error("ERROR WITH TOKEN === ", err);
    //         return res.sendStatus(403)
    //     }
    //     ;
    //     req.body.id = decoded.user._id;
    //     next();
    // });
};

const verifyUserToken = (req, res, next) => {
    //  ============================= REQ.HEADER TOKEN =========================================== 
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.sendStatus(401);
    }

    jwt.verify(token, process.env.SECRET, (err, decoded) => {
        if (err) {
            console.log(err);
            return res.sendStatus(403);
        }
        req.body.id = decoded.id;
        next();
    });
};

const tokenSwitcher = (req, res, next) => {
    try {
        if (req.cookies.token) {
            return verifyUserToken(req, res, next)
        }
    } catch (e) {
        console.log(e)
    }
    if (req.cookies.aToken) {
        return verifyAdminToken(req, res, next)
    }
};

module.exports = {
    verifyAdminToken,
    verifyUserToken,
    tokenSwitcher,
};