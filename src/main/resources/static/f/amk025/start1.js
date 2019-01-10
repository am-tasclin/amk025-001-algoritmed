app.controller('myCtrl', function($scope, $http, $interval, $filter) {
	initApp($scope, $http)
	console.log($scope.request.parameters)
	exe_fn.jsonTree = new JsonTree($scope, $http)

	$scope.saveBloodGroup = function(o, amkElId){
		console.log(o)
		console.log(amkElId)
		console.log($scope.elementsMap[amkElId])
		logEnvirontment()
	}

	var logEnvirontment = function(){
		console.log($scope.referenceElementPaars)
		console.log($scope.referenceElementPaars[85089])
		console.log($scope.elementsMap[$scope.referenceElementPaars[85089]])
		console.log($scope.referenceElementPaars[$scope.request.parameters.l1])
		console.log($scope.elementsMap[$scope.referenceElementPaars[$scope.request.parameters.l1]])
		console.log('амк документ '+ $scope.request.parameters.amk)
		console.log($scope.elementsMap[$scope.request.parameters.amk])
		console.log($scope.elementsMap[85086])
		console.log($scope.elementsMap[$scope.request.parameters.l1])
		console.log('пацієнт')
		console.log($scope.elementsMap[85256])
	}
		
	
	readSql({
		sql:sql_amk025.amk025_template(),
		jsonId:85085,
		afterRead:function(response){
			$scope.amk025_template = JSON.parse(response.data.list[0].docbody)
			console.log('amk')
			console.log($scope.amk025_template)
			json_elementsMap($scope.amk025_template.docRoot, $scope.elementsMap, $scope.referencesMap)
			readRef($scope)
			if($scope.request.parameters.amk)
				exe_fn.jsonTree.readTree($scope.request.parameters.amk)
		}
	})
	readSql({
		sql:sql_amk025.amk025_template(),
		jsonId:5036,
		afterRead:function(response){
			$scope.amk025_dd = JSON.parse(response.data.list[0].docbody)
			console.log($scope.amk025_dd)
			json_elementsMap($scope.amk025_dd.docRoot, $scope.elementsMap, $scope.referencesMap)
		}
	})
	
})

sql_amk025.read_obj_from_docRoot = function(){
	return "SELECT * FROM doc d2, doc d1,docbody " +
	"WHERE d1.doc_id=docbody_id AND d2.doc_id=d1.parent AND d2.doctype IN (6,17) AND d1.reference " +
	" IN (SELECT parent FROM doc where doc_id=:jsonId)"
}
