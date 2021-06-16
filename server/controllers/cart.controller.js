const Cart = require("../models/cart.model");
const Order = require("../models/order.model");
const Product = require("../models/product.model");
const uuid = require('node-uuid');

async function index(req, res, next) {
    var userId = await getUserId(req);

    Cart.find({ userId })
        .then(resp => {
            res.json({ status: true, data: resp, error: null });
        })
        .catch(error => {
            res.status(433).json({ status: false, data: null, error: error.toString() });
        });
}

async function store(req, res, next) {
    var { quantity, product } = req.body;

    var userId = await getUserId(req)
    var notExistsUserId = (!!!userId);

    if (notExistsUserId) {
        // Create new guest
        userId = uuid.v1();
        res.cookie('uuid', userId, { maxAge: 900000 });
    }

    var cartData = {
        userId,
        quantity,
        product
    };

    var existsProductInCart = false;
    var existsProductInOrder = false;

    await Cart.find({ userId, "product._id": product._id }).then(resp => {
        existsProductInCart = (resp.length > 0);
    });

    await Order.find({ userId, status: "pending" ,"products": { $elemMatch: { _id: product._id } } }).then(resp => {
        existsProductInOrder = (resp.length > 0);
    });

    if (existsProductInCart || existsProductInOrder) {
        return res.status(433).json({ status: false, error: "Product have buy" });
    }
    

    Cart.create(cartData).then(resp => {
        res.json({ status: true, data: resp, error: null });
    }).catch(error => {
        next(err);
    });
}

async function payment(req, res, next) {
    var userId = req._id;
    var notExistsUserId = (!!!userId);

    if (notExistsUserId) {
        return res.status(433).json({ status: false });
    }

    var carts = null;
    await Cart.find({ userId }).then(resp => carts = resp);

    if (carts.length > 0) {
        var products = [];
        carts.forEach(cart => {
            products.push({
                _id: cart.product._id,
                quantity: cart.quantity,
                product: cart.product
            });
        });

        await Order.create({
            userId,
            products
        });

        await Cart.deleteMany({ userId });
    }

    return res.json({ status: true });
}

async function destroy(req, res, next) {
    try {
        var userId = await getUserId(req);

        // console.log(req.params.id); //productID
        let product = await Product.findById(req.params.id)

        let UserCart = await Cart.find({ userId: userId });

        // console.log(UserCart) 
        let cart;
        UserCart.forEach(uc => {
            console.log(uc.product, product)
            if (uc.product._id == product.id) {
                cart = uc;
            }
        })
        await Cart.findByIdAndDelete(cart.id);

        // let removeCart = await Cart.findByIdAndDelete("5ee6ed0034414c4010540231");
        res.send();

    } catch (ex) {
        console.log(ex);
    }
}

async function getUserId(req) {
    var userId = req.body.userId;

    var existsUser = (!!req._id);
    var notExistsGuest = (!!!userId);

    var uuidUser = /uuid=([^;]+)/.exec(req.headers.cookie);
    var existsGuest = (Array.isArray(uuidUser) && uuidUser.length > 1);

    if (existsUser) {
        userId = req._id;
        if (existsGuest) {
            await Cart.updateMany({ userId: uuidUser[1] }, { $set: { userId: userId } })
        }
    } else if (notExistsGuest) {
        if (existsGuest) {
            userId = uuidUser[1];
        }
    }

    return userId;
}

module.exports = {
    index,
    store,
    payment,
    destroy
}