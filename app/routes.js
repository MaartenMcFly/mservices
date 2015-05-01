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
    
    app.get('/api/funds', function(req,res) {
	Fund.find(function(err,funds) {
	    if (err)
		    res.send(err)
	
	    res.json(funds);
	});

    });

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
	Price.find(req.query, function(err, prices) {
	   if (err)
		res.send(err);
	   console.log('Prices: ' + prices);
	   res.json(prices);
	});
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

    var positionResponse = function (p, i, response) {
	if (i === p.length)
	    response.send(p)
	else {
	    var newP = p[i].toObject();
	    newP.value = 0;
	    newP.cost = 0;
	    newP.amount = 0;
	    Transaction.find({position_id : newP.orig_key}, function (err, data) {
		var j = 0;
		while (j < data.length) {
		
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
		p[i] = newP;
		positionResponse(p, i+1, response);
	    });
	}
    };

    app.get('/api/positions', function(req, res) {
	Position.find(req.query, function(err, positions) {
	    if (err)
		res.send(err);
	
	    positionResponse(positions, 0, res);
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

		res.send(positions);
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
	    response.send(t);
        else {
            var newT = t[i].toObject();
	    newT.timestamp = new Date(newT.timestamp);
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

		res.send(transactions);
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
