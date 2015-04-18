// app/models/fund.js

// load mongoose since we need it to define a model
var mongoose = require('mongoose');

module.exports = mongoose.model('Fund', {
    orig_key : Number,
    name : String
});
