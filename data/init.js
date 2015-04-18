var util = require('util');
var exec = require('child_process').exec;
var prices = require('./prices');
var positions = require('./positions');
var transactions = require('./transactions');
var fs = require('fs');
var data = ''; 
callback = function(error, stdout, stderr) {
	if (error !== null)
		console.log('exec error: ' + error);
};

 
data += 'curl -X "DELETE" localhost:8080/api/funds\n';
data += 'curl --data "orig_key=1&name=DWS Investment Russia" localhost:8080/api/funds\n';
data += 'curl --data "orig_key=2&name=Fidelity Global Telecommunications Fund" localhost:8080/api/funds\n';
data += 'curl --data "orig_key=3&name=Delta Lloyd Deelnemingen Fonds" localhost:8080/api/funds\n';
data += 'curl --data "orig_key=4&name=Blackrock GF Latin American Fund" localhost:8080/api/funds\n';
data += 'curl --data "orig_key=5&name=Fidelity China Focus" localhost:8080/api/funds\n';
data += 'curl --data "orig_key=6&name=Fidelity Emerging Europe, Middle East and Africa Fund" localhost:8080/api/funds\n';
data += 'curl --data "orig_key=7&name=Blackrock GF New Energy Fund" localhost:8080/api/funds\n';
data += 'curl --data "orig_key=8&name=BNP Paribas Equity Europe Health Care" localhost:8080/api/funds\n';
data += 'curl --data "orig_key=9&name=Henderson Pan European Smaller Companies Fund" localhost:8080/api/funds\n';
data += 'curl --data "orig_key=10&name=JP Morgan JPMF Europe Technology Fund" localhost:8080/api/funds\n';

var priceArray = ["orig_key", "timestamp", "value", "fund_id"];
var positionArray = ["orig_key", "name", "fund_id", "portfolio_id"];
var transactionArray = ["orig_key", "timestamp", "amount", "cost", "type", "price_id", "position_id"];

function getUrlFromString(str, p) {
    arr = str.split(',');
    j = 0, result = '';
    while (j < p.length) {
	result += p[j] + '=' + arr[j];
	if (j < (p.length-1))
	    result += '&';
	console.log(result);
	j++;
    }
    return result;
}

data += "curl -X DELETE localhost:8080/api/prices\n";
var i = 0, port = 8080;
while (i < prices.length) {
    port = 8080 + i%2;
    command = 'curl --data \"' + getUrlFromString(prices[i], priceArray) + '\" localhost:' + port +'/api/prices';
    data += command + "\n"; 
    i++;
}

data += "curl -X DELETE localhost:8080/api/positions\n";
i=0;
while (i < positions.length) {
   command = 'curl --data \"' + getUrlFromString(positions[i], positionArray) + '\" localhost:8080/api/positions';
   data += command + "\n";
   i++;
}

data += "curl -x DELETE localhost:8080/api/transactions\n";
i=0;
while (i < transactions.length) {
   data += 'curl --data \"' + getUrlFromString(transactions[i], transactionArray) + '\" localhost:8080/api/transactions\n';
   i++;
}

fs.writeFile('insertData.sh', data);
exec('chmod +x ./insertData.sh', callback);
