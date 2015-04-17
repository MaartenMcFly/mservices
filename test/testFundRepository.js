var assert = require("assert")
var fs = require('fs')

var FundRepository = require("../lib/FundRepository.js")
var FundFactory = require("../lib/FundFactory.js")
var file = __dirname + '/funds.json'
var fund0, fund1, fund2 

describe('FundRepository', function () {
	before(function() {
		f = new FundFactory()
		testData = JSON.parse(fs.readFileSync(file, 'utf8'))
		fund0 = f.create(testData[0].name, testData[0].symbol, testData[0].ISIN)
		fund1 = f.create(testData[1].name, testData[1].symbol, testData[1].ISIN)
		fund2 = f.create(testData[2].name, testData[2].symbol, testData[2].ISIN)
	})
	r = new FundRepository()
	it('should contain 1 fund', function() {
		r.add(fund0)
		assert.equal(r.size(), 1)
	})
	it('should contain 3 funds', function() {
		r.add(fund1)
		r.add(fund2)
		assert.equal(r.size(), 3)
	})
	it('should return the correct fund', function() {
		console.log("Fund name: " + fund0.name)
		fund = r.find(fund0.name)
		assert.equal(fund.name, fund0.name)
	})
	it('should contain 2 funds after removal of 1', function() {
		r.remove(fund0.name)
		assert.equal(r.size(), 2)
	})
	it('should contain 2 funds after trying to remove the same fund again', function () {
		r.remove(fund0.name)
		assert.equal(r.size(), 2)
	})
})


