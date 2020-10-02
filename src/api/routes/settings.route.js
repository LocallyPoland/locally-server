const app = require("express").Router();
const { get, delte, post, patch } = require("../contollers/variables");

const {
  verifyUserToken,
  verifyAdminToken
} = require("../middleware/jwtAuth");

app.get("/settings", /*verifyUserToken,*/ get.getSettings);

app.patch("/settings", /*verifyUserToken,*/ patch.updateSettings);

// app.delete("/address/:id", verifyAdminToken, delte.deleteAddress);

module.exports = app;
