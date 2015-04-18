// app/models/position.js

// load mongoose since we need it to define a model
var mongoose = require('mongoose');

module.exports = mongoose.model('Position', {
    orig_key : Number,
    name : String,
    fund_id : Number,
    portfolio_id : Number
});
