var FundFactory = require("./lib/FundFactory.js")
var FundRepository = require ("./lib/FundRepository.js")
var fs = require('fs')
var name = 'Some name'

var f = new FundFactory()
var r = new FundRepository()

var options = {name: name, symbol: 'SSYMB', ISIN: 'SI1233455'}
r.add(f.create(options))

options.name = 'Another name'
options.symbol = 'ANAME'
options.ISIN ='LU84834783'
r.add(f.create(options))

console.log(JSON.stringify(r.getAll(), null, 2))

name = 'Another name'
console.log(r.size() + ' ' + JSON.stringify(r.get(name), null, 2))
fs.writeFile("funds.json", JSON.stringify(r.getAll(), null, 2), function(err) {
	if(err) {
		return console.log(err)
	}
})
