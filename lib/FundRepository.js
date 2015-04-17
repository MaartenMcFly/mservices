var _ = require('underscore')
var seneca = require('seneca')()

var FundRepository = module.exports = function FundRepository() {
	this.repo = [] 
}

FundRepository.prototype.add = function add(fund) {
	fund.save$(function(err, fund){
		console.log("Saved " + fund)
	})
	this.repo.push(fund)
}

FundRepository.prototype.find = function find(aName) {
	var fund_entity = seneca.make('fund')
	console.log("The name is: " + aName);
	fund_entity.list$({name:aName}, function(err, list){
		console.log("List " + list)
		return list[0]
	})
	//return  _.find(this.repo, function(fund) {return fund.name == name})
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
		err = new Error("Fund with name " + name + " not in repository")
	}
}

FundRepository.prototype.save = function save(fund) {

}
