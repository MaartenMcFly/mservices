var _ = require('underscore')
var Fund = require('./Fund.js')

var FundRepository = module.exports = function FundRepository() {
	this.repo = [] 
}

FundRepository.prototype.add = function add(fund) {
	this.repo.push(fund)
}

FundRepository.prototype.get = function get(name) {
	return  _.find(this.repo, function(fund) {return fund.name == name})
}

FundRepository.prototype.getAll = function getAll() {
	return this.repo
}

FundRepository.prototype.size = function size() {
	return this.repo.length
}

FundRepository.prototype.remove = function remove(name) {
	fund = this.get(name)
	if(fund != null) {
		index = this.repo.indexOf(fund)
		console.log('Fund:' + fund.name + 'index: ' + index)
		this.repo.splice(index, 1)
	} else {
		throw new Error("Fund with name " + name + " not in repository")
	}
}
