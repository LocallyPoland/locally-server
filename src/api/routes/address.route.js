const app = require("express").Router();
const {
  get, delte, post, patch
} = require("../contollers/user");

const { verifyUserToken, verifyAdminToken } = require("../middleware/jwtAuth");

app.get("/user/address", /*verifyUserToken,*/ get.getAllUsers);

app.get("/user/address/:id", verifyUserToken, get.getUser);

app.post("/address", verifyUserToken, post.register);

app.patch("/address/:id", verifyUserToken, patch.updateUser);

app.delete("/address/:id", verifyAdminToken, delte.deleteUser);

app.patch("/address/restore/:id", verifyAdminToken, patch.restoreUser);

app.patch("/address/soft-delete/:id", verifyAdminToken, delte.softDeleteUser);

module.exports = app;