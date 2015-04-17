Fund = require('./Fund.js')
var seneca = require('seneca')()

FundFactory = module.exports = function FundFactory() {}

FundFactory.prototype.create = function create(name, symbol, ISIN) {
	result = seneca.make('fund')
	result.name = name
	result.symbol = symbol
	result.ISIN = ISIN
	return result 
}

