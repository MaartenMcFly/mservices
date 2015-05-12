var myTodo = angular.module('fluxable.funds',['ngMaterial']);// ['ui.bootstrap', 'ui.bootstrap.tpls']);

myTodo.controller('transactionEditorContent', function ($scope, $modalInstance) {
  console.log('transactionEditorContent controllor registered');

  $scope.ok = function () {
    $modalInstance.close();
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});


myTodo.controller('transactionEditorController', function ($scope, $modal, $log) { 
    $scope.animationsEnabled = true;
    $scope.open = function (size) {
	var modalInstance = $modal.open({	
	    templateUrl : '/public/TransactionEditorContent.html',
	    size : size,
	    controller : 'transactionEditorContent',
	    resolve: {
		    items: function() {
	    	        console.log('Resolve!!!');
			return [];
		    }
	    	}
	    });

	modalInstance.result.then(function () {
	    console.log('Result.then!!!');
	}, function () {
	   $log.info('Model dismissed!');
	});
    };

    $scope.toggleAnimation = function () {
	$scope.animationsEnabled = !$scope.animationsEnabled;
    };
});

myTodo.controller('mainController', function ($scope, $http) {
    $scope.formData = {};
    $scope.selectedRow = null;
    $http.get('/api/funds')
	.success(function(data) {
	    $scope.funds = data;
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
	var date = new Date();
	date = date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate();
 	$http.get('/api/positions?fund_id=' + this.fund.orig_key + '&todate=' + date)
	    .then(function(res) {
		$scope.selectedPosition = res.data[0];
		$http.get('/api/transactions?position_id=' + $scope.selectedPosition.orig_key)
		    .success(function(data) {
			$scope.transactions = data;
		    })
		    .error(function(data) {
			console.log('Error: ' + data);
		    });
	    });
    };
});
