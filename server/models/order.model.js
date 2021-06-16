const mongoose = require('mongoose');
var timestamp = require('./plugins/timestamp');

var orderSchema = new mongoose.Schema({
    userId: String,
    products: Array,
    status: {
        type: String,
        default: "pending"
    },
    created_at: Date,
    updated_at: Date,
});
orderSchema.plugin(timestamp);

module.exports = mongoose.model('Order', orderSchema);