var Fund = function(name, symbol, ISIN) {
	this.name = name;
	this.symbol = symbol;
	this.ISIN = ISIN;
}

Fund.prototype = {
	name: null,
	symbol: null,
	ISIN: null
}

module.exports = Fund;
