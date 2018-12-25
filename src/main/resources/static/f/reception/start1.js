app.controller('myCtrl', function($scope, $http, $interval, $filter) {
	initApp($scope, $http)
	readSql({
		sql:sql_amk025.amk025_template(),
		jsonId:85242,
		afterRead:function(response){
			$scope.patient_template = JSON.parse(response.data.list[0].docbody)
			console.log($scope.patient_template)
			json_elementsMap($scope.patient_template.docRoot, $scope.elementsMap, $scope.referencesMap)
			readRef($scope)
//			console.log($scope.patient_template.docRoot.join_select)
			readSql({
				sql:$scope.patient_template.docRoot.join_select,
				afterRead:function(response){
					$scope.patient_data = response.data.list
					console.log($scope.patient_data)
				},
			})
		}
	})
	
})