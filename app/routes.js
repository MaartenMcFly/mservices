// app/routes.js

// load the todo model
var Todo = require('./models/todo');
var Fund = require('./models/fund');
var Price = require('./models/price');
var Position = require('./models/position');
var Transaction = require('./models/transaction');

// expose the routes to our app with module.exports
module.exports = function(app) {

    // api ---------------------------------------------------------------------
    // get all todos
    app.get('/api/todos', function(req, res) {

        // use mongoose to get all todos in the database
        Todo.find(function(err, todos) {

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
	Price.find(function(err, prices) {
	   if (err)
		res.send(err);
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

    app.get('/api/positions', function(req, res) {
	Position.find(function(err, positions) {
	    if (err)
		res.send(err);
	    res.send(positions);
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

    app.get('/api/transactions', function(req, res) {
	Transaction.find(function(err, transactions) {
	    if (err)
		res.send(err);
	    res.send(transactions);
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

    app.delete('api/transactions', function(req, res) {
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