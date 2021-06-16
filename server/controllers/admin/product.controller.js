const mongoose = require('mongoose');
const Product = require("../../models/product.model");

function index(req, res, next) {
    Product.find({}).then(resp => {
        res.json({ status: true, data: resp, error: null });
    }).catch(err => {
        next(err);
    });
}

function store(req, res, next) {
    const { name, author, description, price, link, imageUrl } = req.body;

    var productData = {
        name,
        author,
        description,
        price,
        link,
        imageUrl
    };

    Product.create(productData)
        .then(resp => {
            res.json({ status: true, error: null });
        }).catch(err => {
            next(err);
        });
}

function show(req, res, next) {
    Product.findById(req.params.id)
        .then(resp => {
            res.json({ status: true, data: resp, error: null });
        })
        .catch(error => {
            next(err);
        });
}

function update(req, res, next) {
    const { name, author, description, price, link, imageUrl } = req.body;

    var productData = {
        name,
        author,
        description,
        price,
        link,
        imageUrl
    };

    Product.updateOne(
        { _id: mongoose.Types.ObjectId(req.params.id) },
        { $set: productData })
        .exec()
        .then(resp => {
            res.json({ status: true, error: null });
        }).catch(err => {
            next(err);
        });
}

function destroy(req, res, next) {
    Product.findByIdAndDelete(req.params.id)
        .then(resp => {
            if (!!resp) {
                res.json({ status: true, error: null });
            } else {
                res.json({ status: false, error: resp });
            }
        }).catch(err => {
            next(err);
        })
}

module.exports = {
    index,
    store,
    show,
    update,
    destroy
}
