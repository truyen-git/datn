const mongoose = require('mongoose');
var timestamp = require('./plugins/timestamp');

var orderAdminSchema = new mongoose.Schema({
    userId: String,
    products: Array,
    status: {
        type: String,
        default: "pending"
    },
    created_at: Date,
    updated_at: Date,
});
orderAdminSchema.plugin(timestamp);

module.exports = mongoose.model('OrderAdmin', orderAdminSchema);