const mongoose = require('mongoose');
var timestamp = require('./plugins/timestamp');

var productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: 'Name can\'t be empty'
    },
    author: {
        type: String,
    },
    description: {
        type: String,
        minlength: 4
    },
    price: {
        type: Number,
        required: 'Price can\'t be empty'
    },
    imageUrl: {
        type: String
    },
    link: {
        type: String
    },
    created_at: Date,
    updated_at: Date,
});

productSchema.plugin(timestamp);

module.exports = mongoose.model('Product', productSchema);