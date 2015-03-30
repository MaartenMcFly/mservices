var Fund = require('./Fund.js')

var FundFactory = module.exports = function FundFactory() {}

FundFactory.prototype.create = function create(name, symbol, ISIN) {
	return new Fund(name, symbol, ISIN) 
}
