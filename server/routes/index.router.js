const express = require('express');
const router = express.Router();

const ctrlUser = require('../controllers/user.controller');
const productController = require("../controllers/product.controller");
const cartController = require("../controllers/cart.controller");
const orderController = require("../controllers/order.controller");

const jwtHelper = require('../config/jwtHelper');

router.post('/register', ctrlUser.register);
router.post('/authenticate', ctrlUser.authenticate);
router.post('/google', ctrlUser.signInGoogle);
router.get('/userProfile', jwtHelper.verifyJwtToken, ctrlUser.userProfile);

router.get("/cart", cartController.index)
    .post("/cart", cartController.store)
    .post("/cart/payment", cartController.payment)
    .delete("/cart/:id", cartController.destroy);

router.get("/products", productController.index)
    .get("/products/:productId", productController.show);

router.get("/orders", jwtHelper.verifyJwtToken, orderController.index)
    .get("/orders/:orderId", jwtHelper.verifyJwtToken, orderController.show)
    .delete("/orders/:orderId", jwtHelper.verifyJwtToken, orderController.destroy);

module.exports = router;



