const app = require("express").Router();
const {
  get, delte, post, patch
} = require("../contollers/address");

const { verifyUserToken, verifyAdminToken } = require("../middleware/jwtAuth");

app.get("/user/address", /*verifyUserToken,*/ get.getAllAddress);

app.get("/user/address/:id", verifyUserToken, get.getAddress);

app.post("/address", verifyUserToken, post.createAddress);

app.patch("/address/:id", verifyUserToken, patch.updateAddress);

app.delete("/address/:id", verifyAdminToken, delte.deleteAddress);

module.exports = app;