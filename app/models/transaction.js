// app/models/tramsaction.js

// load mongoose since we need it to define a model
var mongoose = require('mongoose'), Schema = mongoose.Schema;

var transactionSchema = new Schema({
    orig_key : Number,
    timestamp : Date,
    amount : Number,
    cost : Number,
    type : Number,
    price_id : Number,
    position_id : Number,
})

transactionModel = mongoose.model('Transaction', transactionSchema);

module.exports = transactionModel;
