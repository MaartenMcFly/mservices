// app/models/price.js

// load mongoose since we need it to define a model
var mongoose = require('mongoose');

module.exports = mongoose.model('Price', {
    orig_key : Number,
    timestamp : Date,
    value : Number,
    fund_id : Number
});
