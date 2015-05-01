var myTodo = angular.module('myTodo', []);

function mainController($scope, $http) {
    $scope.formData = {};
    $scope.selectedRow = null;

    $http.get('/api/funds')
	.success(function(data) {
	    $scope.funds = data;
	    console.log(data);
	})
	.error(function(data) {
	    console.log('Error: ' + data);
	});

    // when submitting the add form, send the text to the node API
    $scope.createTodo = function() {
        $http.post('/api/todos', $scope.formData)
            .success(function(data) {
                $scope.formData = {}; // clear the form so our user is ready to enter another
                $scope.todos = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    // delete a todo after checking it
    $scope.deleteTodo = function(id) {
        $http.delete('/api/todos/' + id)
            .success(function(data) {
                $scope.todos = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    $scope.getTransactionsForFund = function(fund) {
	$http.get('/api/positions?fund_id=' + fund.fund_id)
	    .success(function(data) {
		console.log('Data: ' + JSON.stringify(data));
		position_id = data[0].orig_key;
		console.log('Fund: ' + id + ' position: ' + position_id + ' data ' + JSON.stringify(data[0]));
	    })
	    .error(function(data) {
		console.log('Error: ' + data);
	    });
    }
  
    $scope.setSelectedFund = function() {
	$scope.selectedFund = this.fund;
        var position_id;

 	$http.get('/api/positions?fund_id=' + this.fund.orig_key)
	    .then(function(res) {
		$http.get('/api/transactions?position_id=' + res.data[0].orig_key)
		    .success(function(data) {
			$scope.transactions = data;
		    })
		    .error(function(data) {
			console.log('Error: ' + data);
		    });
	    });
    };
}
