var assert = require("assert")
var fs = require('fs')

var Fund = require("../lib/Fund.js")
var file = __dirname + '/funds.json'
var testData, name, symbol, ISIN

describe('Fund', function () {
	before(function() {
		testData = JSON.parse(fs.readFileSync(file, 'utf8'))[0]
		name = testData.name
		symbol = testData.symbol
		ISIN = testData.ISIN
		fund =  new Fund(testData.name, testData.symbol, testData.ISIN)
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


