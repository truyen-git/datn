const Product = require("../models/product.model");

function index(req, res, next) {
    Product.find({})
        .then(resp => {
            res.json({status: true, data: resp, error: null});
        })
        .catch(error => {
            res.status(433).json({status: false, data: null, error: error.toString()});
        });
}

function show(req, res, next) {
    Product.findById(req.params.productId)
        .then(resp => {
            res.json({status: true, data: resp, error: null});
        })
        .catch(error => {
            res.status(433).json({status: false, data: null, error: error.toString()});
        });
}

module.exports = {
    index,
    show
}