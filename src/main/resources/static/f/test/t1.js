app.controller('myCtrl', function($scope, $http, $interval, $filter) {
	console.log(123)
	initApp($scope, $http)

	readSql({
		l:2,
		p:85242,
		sql:"SELECT * FROM doc  WHERE parent=:p limit :l",
		sql1:"SELECT * FROM doc limit :l",
		afterRead:function(respoce){
			console.log(respoce.data)
		}
	})

})
	
