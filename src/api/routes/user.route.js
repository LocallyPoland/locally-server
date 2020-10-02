const app = require("express").Router();
const { get, delte, post, patch } = require("../contollers/user");

const passport = require("passport");

const {
  verifyUserToken,
  verifyAdminToken
} = require("../middleware/jwtAuth");

/**
 * @swagger
 *  /api/v1/users:
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
 *         description: Success + Data
 *      '400':
 *        description: Bad Request
 */
app.get("/users", /*verifyAdminToken,*/ get.getAllUsers);

/**
 * @swagger
 *  /api/v1/user:
 *  get:
 *    tags:
 *    - User Routes
 *    parameters:
 *       - in: req.headers
 *         name: Authorization
 *         description: USER_TOKEN
 *         type: string
 *         required: true
 *    responses:
 *      '200':
 *         description: Success + Data
 *      '400':
 *        description: Bad Request
 */
app.get("/user", verifyUserToken, get.getUser);

/**
 * @swagger
 *  /api/v1/login:
 *  post:
 *    tags:
 *    - User Routes
 *    parameters:
 *       - in: req.body
 *         name: email
 *         description: Email to use for login.
 *         required: true
 *         type: string
 *       - in: req.body
 *         name: password
 *         description: User's password.
 *         required: true
 *         type: string
 *    responses:
 *      '200':
 *         description: Success
 *      '400':
 *        description: Bad Request
 */
app.post("/login", post.login);

app.get("/login/fb", passport.authenticate("facebook", { scope: ["email"] }));

app.get(
  "/fb/cb",
  passport.authenticate("facebook", {
    failureRedirect: "/login",
    session: false
  }),
  get.cbFb
);

/**
 * @swagger
 *  /api/v1/register:
 *  post:
 *    tags:
 *    - User Routes
 *    parameters:
 *       - in: req.body
 *         name: fName
 *         description: User's fName.
 *         required: true
 *         type: string
 *       - in: req.body
 *         name: lName
 *         description: User's lName.
 *         required: true
 *         type: string
 *       - in: req.body
 *         name: phone
 *         description: User's phone.
 *         required: true
 *         type: string
 *       - in: req.body
 *         name: email
 *         description: User's email.
 *         required: true
 *         type: string
 *       - in: req.body
 *         name: password
 *         description: User's password.
 *         required: true
 *         type: string
 *    responses:
 *      '200':
 *         description: Success
 *      '400':
 *        description: Bad Request
 */
app.post("/register", post.register);

app.post("/restore/password", post.restorePassword);

app.post("/change/password", post.changePassword);

/**
 * @swagger
 *  /api/v1/user:
 *  patch:
 *    tags:
 *    - User Routes
 *    parameters:
 *       - in: req.headers
 *         name: Authorization
 *         description: USER_TOKEN
 *         type: string
 *         required: true
 *       - in: req.body
 *         name: fName
 *         description: fName to use for register.
 *         required: true
 *         type: string
 *       - in: req.body
 *         name: lName
 *         description: User's lName.
 *         required: true
 *         type: string
 *       - in: req.body
 *         name: phone
 *         description: User's phone.
 *         required: true
 *         type: string
 *       - in: req.body
 *         name: email
 *         description: User's email.
 *         required: true
 *         type: string
 *       - in: req.body
 *         name: password
 *         description: User's password.
 *         required: true
 *         type: string
 *    responses:
 *      '200':
 *         description: Success
 *      '400':
 *        description: Bad Request
 */
app.patch("/user", verifyUserToken, patch.updateUser);

/**
 * @swagger
 *  /api/v1/user/:id:
 *  delete:
 *    tags:
 *    - User Routes
 *    parameters:
 *       - in: req.headers
 *         name: Authorization
 *         description: ADMIN_TOKEN
 *         type: string
 *         required: true
 *       - in: req.params
 *         name: id
 *         description: id for found such user and delete.
 *         required: true
 *         type: string
 *    responses:
 *      '200':
 *         description: Deleted
 *      '400':
 *        description: Bad Request
 */
app.delete("/user/:id", verifyAdminToken, delte.deleteUser);

/**
 * @swagger
 *  /api/v1/user/restore/:id:
 *  patch:
 *    tags:
 *    - User Routes
 *    parameters:
 *       - in: req.headers
 *         name: Authorization
 *         description: ADMIN_TOKEN
 *         type: string
 *         required: true
 *       - in: req.params
 *         name: id
 *         description: id for found such user and restore.
 *         required: true
 *         type: string
 *    responses:
 *      '200':
 *         description: Success
 *      '400':
 *        description: Bad Request
 */
app.patch("/user/restore/:id", verifyAdminToken, patch.restoreUser);

/**
 * @swagger
 *  /api/v1/user/soft-delete/:id:
 *  patch:
 *    tags:
 *    - User Routes
 *    parameters:
 *       - in: req.headers
 *         name: Authorization
 *         description: ADMIN_TOKEN
 *         type: string
 *         required: true
 *       - in: req.params
 *         name: id
 *         description: id for found such user and restore.
 *         required: true
 *         type: string
 *    responses:
 *      '200':
 *         description: Success
 *      '400':
 *        description: Bad Request
 */
app.patch("/user/soft-delete/:id", verifyAdminToken, delte.softDeleteUser);

module.exports = app;
