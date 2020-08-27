const app = require("express").Router();
const {
  get, delte, post, patch
} = require("../contollers/order");

const { verifyUserToken, verifyAdminToken } = require("../middleware/jwtAuth");

app.get("/order", verifyAdminToken, get.getAllOrders);

app.get("/order/:id", verifyAdminToken, get.getOrder);

app.post("/order", verifyUserToken, post.createOrder);

app.patch("/order/:id", verifyAdminToken, patch.updateOrder);

app.delete("/order/:id", verifyAdminToken, delte.deleteOrder);

// app.patch("/order/restore/:id", verifyAdminToken, patch.restoreUser);

// app.patch("/order/soft-delete/:id", verifyAdminToken, delte.softDeleteUser);

module.exports = app;