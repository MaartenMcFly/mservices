var assert = require("assert")
var fs = require('fs')

var FundFactory = require("../lib/FundFactory.js")
var file = __dirname + '/funds.json'
var testData, name, symbol, ISIN

describe('FundFactory', function () {
	before(function() {
		testData = JSON.parse(fs.readFileSync(file, 'utf8'))[0]
		name = testData.name
		symbol = testData.symbol
		ISIN = testData.ISIN
		fund =  new FundFactory().create(name, symbol, ISIN);
	})
	it('should have the correct name ', function() {
		assert.equal(fund.name, name)
	})
	it('should have the correct symbol ', function() {
		assert.equal(fund.symbol, symbol)
	})
	it('should have the correct ISIN ', function() {
		assert.equal(fund.ISIN, ISIN)
	})
})


