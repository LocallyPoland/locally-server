const app = require("express").Router();
const {get, delte, post, patch} = require("../contollers/order");

const {
    verifyUserToken,
    verifyAdminToken,
    tokenSwitcher
} = require("../middleware/jwtAuth");

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

/**
 * @swagger
 *  /api/v1/order/:id:
 *  get:
 *    tags:
 *    - Orders Routes
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
app.get("/order/:id", tokenSwitcher, get.getOrder);

app.get("/user/history", verifyUserToken, get.userOrderHistory);

/**
 * @swagger
 *  /api/v1/order:
 *  post:
 *    tags:
 *    - Orders Routes
 *    parameters:
 *       - in: req.headers
 *         name: Authorization
 *         description: USER_TOKEN
 *         type: string
 *         required: true
 *       - in: req.body
 *         name: userID
 *         description: User's ID.
 *         required: true
 *         type: string
 *       - in: req.body
 *         name: parcel
 *         description: parcel Array.
 *         required: true
 *         type: string
 *       - in: req.body
 *         name: sum
 *         description: Order sum.
 *         required: true
 *         type: string
 *       - in: req.body
 *         name: weight
 *         description: parcel weight.
 *         required: true
 *         type: string
 *       - in: req.body
 *         name: length
 *         description: parcel length.
 *         required: true
 *         type: string
 *       - in: req.body
 *         name: status
 *         description: Order status.
 *         required: true
 *         type: string
 *       - in: req.body
 *         name: pickUp
 *         description: parcel pickUp.
 *         required: true
 *         type: string
 *       - in: req.body
 *         name: deliveryCity
 *         description: parcel deliveryCity.
 *         required: true
 *         type: string
 *       - in: req.body
 *         name: deliveryStreet
 *         description: parcel deliveryStreet.
 *         required: true
 *         type: string
 *       - in: req.body
 *         name: deliveryHouse
 *         description: parcel deliveryHouse.
 *         required: true
 *         type: string
 *       - in: req.body
 *         name: deliveryApartament
 *         description: parcel deliveryApartament.
 *         required: true
 *         type: string
 *       - in: req.body
 *         name: paymentType
 *         description: order paymentType.
 *         required: true
 *         type: string
 *    responses:
 *      '200':
 *         description: Success
 *      '400':
 *        description: Bad Request
 */
app.post("/order", verifyUserToken, post.createOrder);

/**
 * @swagger
 *  /api/v1/order/:id:
 *  patch:
 *    tags:
 *    - Orders Routes
 *    parameters:
 *       - in: req.headers
 *         name: Authorization
 *         description: ADMIN_TOKEN
 *         type: string
 *         required: true
 *       - in: req.params
 *         name: id
 *         description: id for found such order and patch.
 *         required: true
 *         type: string
 *       - in: req.body
 *         name: userID
 *         description: User's ID.
 *         required: true
 *         type: string
 *       - in: req.body
 *         name: parcel
 *         description: parcel Array.
 *         required: true
 *         type: string
 *       - in: req.body
 *         name: sum
 *         description: Order sum.
 *         required: true
 *         type: string
 *       - in: req.body
 *         name: weight
 *         description: parcel weight.
 *         required: true
 *         type: string
 *       - in: req.body
 *         name: length
 *         description: parcel length.
 *         required: true
 *         type: string
 *       - in: req.body
 *         name: status
 *         description: Order status.
 *         required: true
 *         type: string
 *       - in: req.body
 *         name: pickUp
 *         description: parcel pickUp.
 *         required: true
 *         type: string
 *       - in: req.body
 *         name: deliveryCity
 *         description: parcel deliveryCity.
 *         required: true
 *         type: string
 *       - in: req.body
 *         name: deliveryStreet
 *         description: parcel deliveryStreet.
 *         required: true
 *         type: string
 *       - in: req.body
 *         name: deliveryHouse
 *         description: parcel deliveryHouse.
 *         required: true
 *         type: string
 *       - in: req.body
 *         name: deliveryApartament
 *         description: parcel deliveryApartament.
 *         required: true
 *         type: string
 *       - in: req.body
 *         name: paymentType
 *         description: order paymentType.
 *         required: true
 *         type: string
 *    responses:
 *      '200':
 *         description: Success
 *      '400':
 *        description: Bad Request
 */
app.patch("/order/:id", verifyAdminToken, patch.updateOrder);

/**
 * @swagger
 *  /api/v1/order/:id:
 *  delete:
 *    tags:
 *    - Orders Routes
 *    parameters:
 *       - in: req.headers
 *         name: Authorization
 *         description: ADMIN_TOKEN
 *         type: string
 *         required: true
 *       - in: req.params
 *         name: id
 *         description: id for found such order and delete.
 *         required: true
 *         type: string
 *    responses:
 *      '200':
 *         description: Deleted
 *      '400':
 *        description: Bad Request
 */
app.delete("/order/:id", verifyUserToken, delte.deleteOrder);

app.get("/history", verifyAdminToken, get.getOrdersHistory);

// app.patch("/order/restore/:id", verifyAdminToken, patch.restoreUser);

// app.patch("/order/soft-delete/:id", verifyAdminToken, delte.softDeleteUser);

module.exports = app;
