const app = require("express").Router();
const {
    get, delte, post, patch
} = require("../contollers/order");

const {verifyUserToken, verifyAdminToken} = require("../middleware/jwtAuth");

app.get("/order", verifyAdminToken, get.getAllOrders);

/**
 * @swagger
 *  /api/v1/order/stats:
 *  get:
 *    tags:
 *    - Stats Routes
 *    parameters:
 *       - in: req.headers
 *         name: Authorization
 *         description: ADMIN_TOKEN
 *         type: string
 *         required: true
 *    responses:
 *      '200':
 *         description: Success
 *      '400':
 *        description: Bad Request
 */
app.get("/order/stats", get.orderStats);

app.get("/order/:id", verifyAdminToken, get.getOrder);

app.post("/order", verifyUserToken, post.createOrder);

app.patch("/order/:id", verifyAdminToken, patch.updateOrder);

app.delete("/order/:id", verifyAdminToken, delte.deleteOrder);

// app.patch("/order/restore/:id", verifyAdminToken, patch.restoreUser);

// app.patch("/order/soft-delete/:id", verifyAdminToken, delte.softDeleteUser);

module.exports = app;