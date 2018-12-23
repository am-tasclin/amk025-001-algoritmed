app.controller('myCtrl', function($scope, $http, $interval, $filter) {
	initApp($scope, $http)
	$scope.elementsMap = {}
	readSql({
		sql:sql_amk025.amk025_template(),
		jsonId:85085,
		afterRead:function(response){
			$scope.amk025_template = JSON.parse(response.data.list[0].docbody)
			console.log($scope.amk025_template)
			json_elementsMap($scope.amk025_template.docRoot, $scope.elementsMap)
		}
	})
	readSql({
		sql:sql_amk025.amk025_template(),
		jsonId:5036,
		afterRead:function(response){
			$scope.amk025_dd = JSON.parse(response.data.list[0].docbody)
			console.log($scope.amk025_dd)
			json_elementsMap($scope.amk025_dd.docRoot, $scope.elementsMap)
		}
	})
})

var sql_amk025 = {}
sql_amk025.amk025_template = function(){
	return "SELECT * FROM doc d2, doc d1,docbody " +
			"WHERE d1.doc_id=docbody_id AND d2.doc_id=d1.parent AND d2.doctype IN (6,17) AND d1.reference=:jsonId"
}
