const mongoose = require('mongoose');

const ProductSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: String,
    },
    path: {
        type: String
    },
    color: {
        type: String
    },
    type: {
        type: String
    },
    makhachhang: {
        type: String
    },
    tenkhachhang: {
        type: String
    },
},{
    collection: 'Products'
})

const ProductModel = new mongoose.model('Product', ProductSchema)

module.exports = ProductModel