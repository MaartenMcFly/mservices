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
 
    $scope.getPositionHistory = function() {
	var pivotDate = new Date(2006,11,0);
	var todate = new Date();
	var positionArray = [];

	calculate(pivotDate, todate, positionArray);
    }
 
    var calculate = function(date, today, positionArray) {
	console.log('Calculate called with ' + date);
	if (date < today) {
	    todateString = date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate();
	    querystring = '/api/positions?fund_id=' + $scope.selectedFund.orig_key + '&todate=' + todateString;
	    $http.get(querystring)	
		.success(function(data) {
		    positionArray.push(data);
		    console.log('In array: ' + positionArray.length);
		    calculate(addDays(date, 7), today, positionArray);
		})
		.error(function(data) {
		    console.log('Error: ' + data);
		});
	}
	else {
	    console.log('Data: ' + JSON.stringify(positionArray));
	    return positionArray;
	}
    }

    var addDays = function (someDate, days) {
	return new Date(someDate.getTime() + days*24*60*60*1000);
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
