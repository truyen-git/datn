const mongoose = require('mongoose');

var cartSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: 'User ID can\'t be empty'
    },
    quantity: {
        type: Number,
        default: 1
    },
    product: {
        type: Object,
        required: 'User ID can\'t be empty'
    }
});

module.exports = mongoose.model('Cart', cartSchema);