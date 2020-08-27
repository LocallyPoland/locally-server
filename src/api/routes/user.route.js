const app = require("express").Router();
const {
  get, delte, post, patch
} = require("../contollers/user");

const passport = require('passport');

const { verifyUserToken, verifyAdminToken } = require("../middleware/jwtAuth");

app.get("/users", verifyAdminToken, get.getAllUsers);

app.get("/user", verifyUserToken, get.getUser);

app.post("/login", post.login);

app.get("/login/fb", passport.authenticate('facebook', { scope: ['email'] }));

app.get("/fb/cb", passport.authenticate('facebook', { failureRedirect: '/login', session: false }), get.cbFb);

app.post("/register", post.register);

app.post("/restore/password", post.restorePassword);

app.post("/change/password", post.changePassword);

app.patch("/user", verifyUserToken, patch.updateUser);

app.delete("/user/:id", verifyAdminToken, delte.deleteUser);

app.patch("/user/restore/:id", verifyAdminToken, patch.restoreUser);

app.patch("/user/soft-delete/:id", verifyAdminToken, delte.softDeleteUser);

module.exports = app;