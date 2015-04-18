// app/models/tramsaction.js

// load mongoose since we need it to define a model
var mongoose = require('mongoose');

module.exports = mongoose.model('Transaction', {
    orig_key : Number,
    timestamp : String,
    amount : Number,
    cost : Number,
    type : Number,
    price_id : Number,
    position_id : Number
});
