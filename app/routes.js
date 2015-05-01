// app/routes.js

// load the todo model
var Todo = require('./models/todo');
var Fund = require('./models/fund');
var Price = require('./models/price');
var Position = require('./models/position');
var Transaction = require('./models/transaction');
var _ = require('underscore');
var Q = require('q');

// expose the routes to our app with module.exports
module.exports = function(app) {
/*
    // api ---------------------------------------------------------------------
    // get all todos
    app.get('/api/todos', function(req, res) {
        // use mongoose to get all todos in the database
        Todo.find(req.query, function(err, todos) {
            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err)

            res.json(todos); // return all todos in JSON format
        });
    });
 */   
    app.get('/api/funds', function(req,res) {
	Fund.find(function(err,funds) {
	    if (err)
		    res.send(err)
	
	    res.json(funds);
	});

    });
/*
    // create todo and send back all todos after creation
    app.post('/api/todos', function(req, res) {

        // create a todo, information comes from AJAX request from Angular
        Todo.create({
            text : req.body.text,
            done : false
        }, function(err, todo) {
            if (err)
                res.send(err);

            // get and return all the todos after you create another
            Todo.find(function(err, todos) {
                if (err)
                    res.send(err)
                res.json(todos);
            });
        });
    });
*/
    app.post('/api/funds', function(req, res) {
	Fund.create({
	    orig_key : req.body.orig_key,
	    name : req.body.name
	}, function(err, fund) {
	    if (err)
		res.send(err);

	    Fund.find(function(err, funds) {
		if (err)
		    res.send(err)
		res.json(funds);
	    });
	});
    });

    app.delete('/api/funds', function(req,res) {
	Fund.remove(function (err) {
	    if (err)
		res.send(err);
		
	    res.send('');
	});
    });

    app.get('/api/prices', function(req, res) {
	if (req.query.fund_id && req.query.timestamp) {
	    Price.find({fund_id : req.query.fund_id, 
			timestamp : {"$lt" : req.query.timestamp}}, function (err, data) {
		res.json(data);
	})}
	else {
	    Price.find(req.query, function(err, prices) {
	       if (err)
		    res.send(err);
	       res.json(prices);
	    });
	}
    });
		
    app.post('/api/prices', function(req, res) {
	Price.create({
	   orig_key : req.body.orig_key,
	   timestamp : req.body.timestamp,
	   value : req.body.value,
	   fund_id : req.body.fund_id
	}, function(err, price) {
	   if (err)
		res.send(err);

	   Price.find(function(err, prices) {
		if (err)
		     res.send(err);
		res.json(prices);
	   });
	});
    });
  
    app.delete('/api/prices', function(req,res) {
	Price.remove(function(err) {
	   if (err)
		res.send(err);
	   res.send('');
	});
    });

    var positionResponse = function (p, i, response, todate) {
	if (i === p.length)
	    response.json(p)
	else {
	    var newP = p[i].toObject();
	    var query = '';
	    newP.value = 0;
	    newP.cost = 0;
	    newP.amount = 0;
	    newP.lastprice = 0;
	    newP.lastpricedate;
	    if (!todate) {
		x = new Date();
		todate = x.getFullYear() + '-' + x.getMonth() + '-' + x.getDate();
	    }
	    Transaction.find({position_id : newP.orig_key,
			      timestamp : {"$lte" : todate}}, function (err, data) {
		Price.findOne({fund_id : newP.fund_id,
			       timestamp : {"$lte" : todate}}, function (err, price) {
		    newP.lastprice = price.value;
		    newP.lastpricedate = price.timestamp;
		    var j = 0;
		    while (j < data.length) {
		        newP.cost += data[j].cost;
		        switch (data[j].type) {
		            case 0 :
			        newP.amount += data[j].amount;
			        break;
		            case 1 : 
			        newP.amount -= data[j].amount;
			        break;
		            case 2 :
			        newP.amount += data[j].amount;
			        break;
		            default : 
			        ;
		        }
		        j++;
		    }
 		    newP.value = newP.lastprice * newP.amount - newP.cost;
		    p[i] = newP;
		    positionResponse(p, i+1, response, todate);
	        });
	    });
	}
    };

    app.get('/api/positions', function(req, res) {
	var todate;

	if (req.query.todate) {
	    todate = req.query.todate;
	    delete req.query.todate;
	}

	Position.find(req.query, function(err, positions) {
	    if (err)
		res.send(err);
	
	    positionResponse(positions, 0, res, todate);
	});
    });

    app.post('/api/positions', function(req, res) {
	Position.create({
	    orig_key : req.body.orig_key,
	    name : req.body.name,
	    fund_id : req.body.fund_id,
	    portfolio_id : req.body.portfolio_id
	}, function (err) {
	   if (err)
		res.send(err);
           Position.find(function(err, positions) {
		if (err)
		    res.send(err);

		res.json(positions);
	   });
	});
    });
		
    app.delete('/api/positions', function(req, res) {
	Position.remove(function(err) {
	   if (err)
		res.send(err);
     	   res.end('');
	});
    });

    var transactionResponse = function (t,i, response) {
	if ( i === t.length)
	    response.json(t);
        else {
            var newT = t[i].toObject();
	    switch (newT.type) {
		case 0 : 
		    newT.type = 'Buy';
		    break;
		case 1 :
		    newT.type = 'Sell';
		    break;
		case 2 :
		    newT.type = 'Dividend';
		    break;
		default :
		    newT.type = 'Unknown';
	    }
	    Price.findOne({ orig_key : newT.price_id }, function (err, p) {
		newT.price = p.value;
		delete newT.price_id;
		t[i] = newT;
		transactionResponse(t, i+1 , response);
	    });
	};
    }

    app.get('/api/transactions', function(req, res) {
	var transactions;
	Transaction.find(req.query, function(err, transactions) {
	    if (err)
		res.send(err);

	    transactionResponse(transactions, 0, res); 	
    	});
    });

    app.post('/api/transactions', function(req, res) {
	Transaction.create({
	    orig_key : req.body.orig_key,
	    timestamp : req.body.timestamp,
	    amount : req.body.amount,
	    cost : req.body.cost,
	    type : req.body.type,
   	    price_id : req.body.price_id,
	    position_id : req.body.position_id
	}, function(err) {
	    if (err)
		res.send(err);

	    Transaction.find(err, function(err, transactions) {
		if (err)
		    res.send(err);

		res.json(transactions);
	    });
	});
    });

    app.delete('/api/transactions', function(req, res) {
	Transaction.remove(function (err) {
	    if (err)
		res.send(err);
	    res.send('');
	});
    });

    // delete a todo
    app.delete('/api/todos/:todo_id', function(req, res) {
        Todo.remove({
            _id : req.params.todo_id
        }, function(err, todo) {
            if (err)
                res.send(err);

            // get and return all the todos after you create another
            Todo.find(function(err, todos) {
                if (err)
                    res.send(err)
                res.json(todos);
            });
        });
    });

    // application -------------------------------------------------------------
    app.get('*', function(req, res) {
        res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });

};
