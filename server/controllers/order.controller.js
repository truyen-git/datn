const mongoose = require('mongoose');
const Order = require("../models/order.model");

function index(req, res, next) {
    Order.find({ userId: req._id })
        .then(resp => {
            res.json({status: true, data: resp, error: null});
        })
        .catch(error => {
            res.status(433).json({status: false, data: null, error: error.toString()});
        });
}

function show(req, res, next) {
    Order.find({
            _id: mongoose.Types.ObjectId(req.params.orderId),
            userId: req._id
        })
        .then(resp => {
            res.json({status: true, data: resp, error: null});
        })
        .catch(error => {
            res.status(433).json({status: false, data: null, error: error.toString()});
        });
}

function destroy(req, res, next) {
    Order.findByIdAndDelete(req.params.orderId)
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
    show,
    destroy
}