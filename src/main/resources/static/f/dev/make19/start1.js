app.controller('myCtrl', function($scope, $http, $interval, $filter) {
	initApp($scope, $http)
	new DocType($scope, $http)
	var jsonDoc = new JsonDoc($scope, $http, $scope.request.parameters.jsonId)
	jsonDoc.readDoc()
	console.log(jsonDoc)
	
	$scope.addFirstChildElement = function(doctype, reference){
		writeSql({
			sql : "INSERT INTO doc (doctype, parent) VALUES (:doctype, :parent)",
			doctype : doctype,
			parent : $scope.request.parameters.jsonId,
			dataAfterSave:function(response){
				console.log(response)
			}
		})
	}
})
